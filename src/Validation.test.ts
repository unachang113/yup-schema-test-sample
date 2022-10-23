import { idValidationSchema, validationSchema } from "./Validation";
import * as yup from "yup";

describe("IDのschemaテスト", () => {
  it("IDが5文字以下の場合、エラー", () => {
    const testValue = "hoge"; // 4文字のテキスト

    expect(() => {
      idValidationSchema.validateSync(testValue);
    }).toThrow("※5文字以上で入力して下さい");
  });

  it("IDが10文字以上の場合、エラー", () => {
    const testValue = "hogehogehoge"; // 12文字のテキスト

    expect(() => {
      idValidationSchema.validateSync(testValue);
    }).toThrow("※10文字以下で入力して下さい");
  });

  it("IDが空の場合、エラー", () => {
    const testValue = "";

    expect(() => {
      idValidationSchema.validateSync(testValue);
    }).toThrow("※IDは必須です");
  });
});

describe("objectSchemaのテスト", () => {
  it("IDが数値以外の値の場合、エラー", () => {
    const testValues = {
      id: "",
      name: "テスト",
      description: "説明文です",
    };

    expect(() => {
      validationSchema.validateSync(testValues);
    }).toThrow("※IDは数値で入力して下さい");
  });

  it("IDが0の場合、エラー", () => {
    const testValues = {
      id: 0,
      name: "テスト",
      description: "説明文です",
    };

    expect(() => {
      validationSchema.validateSync(testValues);
    }).toThrow("※IDは1以上で入力して下さい");
  });

  it("IDが空の場合、エラー", () => {
    const testValues = {
      name: "テスト",
      description: "説明文です",
    };

    expect(() => {
      validationSchema.validateSync(testValues);
    }).toThrow("※IDは必須です");
  });

  it("名前が空の場合、エラー", () => {
    const testValues = {
      id: 123456,
      name: "",
      description: "説明文です",
    };

    expect(() => {
      validationSchema.validateSync(testValues);
    }).toThrow("※名前は必須です");
  });

  it("説明文が空の場合、正常", () => {
    const testValues = {
      id: 123456,
      name: "山田太郎",
      description: "",
    };

    expect(validationSchema.isValidSync(testValues)).toBe(true);
  });

  it("説明文が140文字以上の場合、エラー", () => {
    // 141文字のダミーテキスト作成
    const descriptionText = new Array(141).fill("あ").join("");
    const testValues = {
      id: 123456,
      name: "山田太郎",
      description: descriptionText,
    };

    expect(() => {
      validationSchema.validateSync(testValues);
    }).toThrow("※説明文は140文字以下で入力して下さい");
  });

  it("※IDが日本語でnameがない場合、IDとnameでエラーが返ってくる", async () => {
    const testValue = {
      id: "あいうえお",
      name: "",
      description: "",
    };

    try {
      await validationSchema.validate(testValue, { abortEarly: false }); // abortEarly: falseを設定すると各項目のエラーがすべて返ってくる
    } catch (validationError) {
      const validationErrors: Record<string, string> = {};
      const yupError = validationError as yup.ValidationError;

      yupError.inner.forEach((error) => {
        if (error.path) {
          validationErrors[error.path] = error.message;
        }
      });

      // eslint-disable-next-line jest/no-conditional-expect
      expect(validationErrors).toEqual({
        id: "※IDは数値で入力して下さい",
        name: "※名前は必須です",
      });
    }
  });
});
