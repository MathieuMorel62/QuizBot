import axios from "axios";
import 'dotenv/config';

// Configuration de l'API Mistral
const MISTRAL_API_URL = process.env.MISTRAL_API_URL;
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

export async function strict_output(
  system_prompt: string,
  user_prompt: string | string[],
  output_format: OutputFormat,
  default_category: string = "",
  output_value_only: boolean = false,
  model: string = "open-mixtral-8x7b",
  temperature: number = 1,
  num_tries: number = 3,
  verbose: boolean = false
): Promise<
  {
    question: string;
    answer: string;
  }[]
> {
  const list_input: boolean = Array.isArray(user_prompt);
  const dynamic_elements: boolean = /<.*?>/.test(JSON.stringify(output_format));
  const list_output: boolean = /\[.*?\]/.test(JSON.stringify(output_format));
  let error_msg: string = "";

  for (let i = 0; i < num_tries; i++) {
    let output_format_prompt: string = `\nYou are to output the following in json format: ${JSON.stringify(
      output_format
    )}. \nDo not put quotation marks or escape character \\ in the output fields.`;

    if (list_output) {
      output_format_prompt += `\nIf output field is a list, classify output into the best element of the list.`;
    }

    if (dynamic_elements) {
      output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden\nAny output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}`;
    }

    if (list_input) {
      output_format_prompt += `\nGenerate a list of json, one json for each input element.`;
    }

    try {
      const response = await axios.post(
        `${MISTRAL_API_URL}/chat/completions`,
        {
          model: model,
          temperature: temperature,
          messages: [
            {
              role: "system",
              content: system_prompt + output_format_prompt + error_msg,
            },
            { role: "user", content: user_prompt.toString() },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${MISTRAL_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      let res: string = response.data.choices[0].message?.content?.replace(/'/g, '"') ?? "";

      // Correction des guillemets français mal échappés
      res = res.replace(/(\w)"(\w)/g, "$1'$2").replace(/“|”/g, '"').replace(/«|»/g, '"');

      if (verbose) {
        console.log(
          "System prompt:",
          system_prompt + output_format_prompt + error_msg
        );
        console.log("\nUser prompt:", user_prompt);
        console.log("\nMistral response:", res);
      }

      try {
        let output: any = JSON.parse(res);

        if (list_input) {
          if (!Array.isArray(output)) {
            throw new Error("Output format not in a list of json");
          }
        } else {
          output = [output];
        }

        for (let index = 0; index < output.length; index++) {
          for (const key in output_format) {
            if (/<.*?>/.test(key)) {
              continue;
            }

            if (!(key in output[index])) {
              throw new Error(`${key} not in json output`);
            }

            if (Array.isArray(output_format[key])) {
              const choices = output_format[key] as string[];
              if (Array.isArray(output[index][key])) {
                output[index][key] = output[index][key][0];
              }
              if (!choices.includes(output[index][key]) && default_category) {
                output[index][key] = default_category;
              }
              if (output[index][key].includes(":")) {
                output[index][key] = output[index][key].split(":")[0];
              }
            }
          }

          if (output_value_only) {
            output[index] = Object.values(output[index]);
            if (output[index].length === 1) {
              output[index] = output[index][0];
            }
          }
        }

        return list_input ? output : output[0];
      } catch (e) {
        error_msg = `\n\nResult: ${res}\n\nError message: ${e}`;
        console.log("An exception occurred:", e);
        console.log("Current invalid json format:", res);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 429) {
          console.error('Rate limit exceeded, retrying...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        } else {
          console.error('Axios error:', error.message);
          throw error;
        }
      } else {
        console.error('Unexpected error:', error);
        throw error;
      }
    }
  }

  return [];
}
