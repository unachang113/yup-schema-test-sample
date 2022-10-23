import * as yup from "yup";
/**
 * IDのvalidationSchema sample
 */
export const idValidationSchema = yup
  .string()
  .required("※IDは必須です")
  .min(5, "※5文字以上で入力して下さい")
  .max(10, "※10文字以下で入力して下さい");

/**
 * objectSchemaのsample
 */
export const validationSchema = yup.object().shape({
  id: yup
    .number()
    .required("※IDは必須です")
    .typeError("※IDは数値で入力して下さい")
    .min(1, "※IDは1以上で入力して下さい"),
  name: yup.string().required("※名前は必須です"),
  description: yup.string().max(140, "※説明文は140文字以下で入力して下さい"),
});
