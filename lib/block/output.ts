export type CommonOutput = {
  name: string;
};

export type BooleanOutput = CommonOutput & {
  type: "Boolean";
};

export type BooleanArrayOutput = CommonOutput & {
  type: "BooleanArray";
};

export type LongOutput = CommonOutput & {
  type: "Long";
};

export type LongArrayOutput = CommonOutput & {
  type: "LongArray";
};

export type DoubleOutput = CommonOutput & {
  type: "Double";
};

export type DoubleArrayOutput = CommonOutput & {
  type: "DoubleArray";
};

export type StringOutput = CommonOutput & {
  type: "String";
};

export type StringArrayOutput = CommonOutput & {
  type: "StringArray";
};

export type BigIntegerOutput = CommonOutput & {
  type: "BigInteger";
};

export type BigIntegerArrayOutput = CommonOutput & {
  type: "BigIntegerArray";
};

export type BigDecimalOutput = CommonOutput & {
  type: "BigDecimal";
};

export type BigDecimalArrayOutput = CommonOutput & {
  type: "BigDecimalArray";
};

export type DateTimeOutput = CommonOutput & {
  type: "DateTime";
};

export type DateTimeArrayOutput = CommonOutput & {
  type: "DateTimeArray";
};

export type ObjectOutput = CommonOutput & {
  type: "Object";
  struct: OutputBlockVariables[];
};

export type ObjectArrayOutput = CommonOutput & {
  type: "ObjectArray";
  struct: ObjectOutput[];
};

export type FileOutput = CommonOutput & {
  type: "File";
};

export type OutputBlockVariables =
  | BooleanOutput
  | BooleanArrayOutput
  | LongOutput
  | LongArrayOutput
  | DoubleOutput
  | DoubleArrayOutput
  | StringOutput
  | StringArrayOutput
  | BigIntegerOutput
  | BigIntegerArrayOutput
  | BigDecimalOutput
  | BigDecimalArrayOutput
  | DateTimeOutput
  | DateTimeArrayOutput
  | ObjectOutput
  | ObjectArrayOutput
  | FileOutput;
