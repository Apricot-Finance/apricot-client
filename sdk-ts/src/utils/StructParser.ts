import Decimal from "decimal.js";

export enum FieldType {
  str, u8, u32, u64, u128, f64
}

export const TYPE_TO_LENGTH: {[type in FieldType] : number} = {
  [FieldType.str]: 0,
  [FieldType.u8]: 1,
  [FieldType.u32]: 4,
  [FieldType.u64]: 8,
  [FieldType.u128]: 16,
  [FieldType.f64]: 8,
};

const TWO_32 = new Decimal(4294967296);
const TWO_64 = TWO_32.mul(TWO_32);

export const TYPE_TO_ENCODER: {[type in FieldType]: (value:any, buffer:Buffer, offset: number) => void} = {
  [FieldType.str] : (value: string, buffer: Buffer, offset: number) => {
    throw new Error("Unable to encode STR type");
  },
  [FieldType.u8] : (value: number, buffer: Buffer, offset: number) => {
    buffer.writeUInt8(value);
  },
  [FieldType.u32] : (value: number, buffer: Buffer, offset: number) => {
    buffer.writeUInt32LE(value, offset);
  },
  [FieldType.u64] : (value: number, buffer: Buffer, offset: number) => {
    buffer.writeUInt32LE(value % 4294967296, offset);
    buffer.writeUInt32LE(value / 4294967296, offset + 4);
  },
  [FieldType.u128] : (value: number, buffer: Buffer, offset: number) => {
    throw new Error("Unable to encode u128 type"); // not needed for now
  },
  [FieldType.f64] : (value: number, buffer: Buffer, offset: number) => {
    buffer.writeDoubleLE(value, offset);
  },
};

export const TYPE_TO_DECODER: {[type in FieldType]: (buffer:Buffer, offset: number) => any} = {
  [FieldType.str] : (buffer: Buffer, offset: number) => {
    throw new Error("Unable to encode STR type");
  },
  [FieldType.u8] : (buffer: Buffer, offset: number) => {
    return buffer.readUInt8(offset);
  },
  [FieldType.u32] : (buffer: Buffer, offset: number) => {
    return buffer.readUInt32LE(offset);
  },
  [FieldType.u64] : (buffer: Buffer, offset: number) => {
    const low = new Decimal(buffer.readUInt32LE(offset));
    const high = new Decimal(buffer.readUInt32LE(offset + 4));
    return high.mul(TWO_32).add(low);
  },
  [FieldType.u128] : (buffer: Buffer, offset: number) => {
    const u64Decoder = TYPE_TO_DECODER[FieldType.u64];
    const low = u64Decoder(buffer, offset);
    const high = u64Decoder(buffer, offset + 8);
    return high.mul(TWO_64).add(low);
  },
  [FieldType.f64] : (buffer: Buffer, offset: number) => {
    buffer.readDoubleLE(offset);
  },
};

class FieldDecl {
  constructor(
    public name: string,
    public type: FieldType,
    public len: number = 0,
  ) { 
  }
  getLength() {
    if(this.type === FieldType.str) {
      return this.len;
    }
    else {
      return TYPE_TO_LENGTH[this.type];
    }
  }
}

export class StructParser {
  fields : FieldDecl[];
  nameToField: {[name:string]: FieldDecl};
  constructor(
    fields: FieldDecl[] = []
  ) {
    this.fields = [];
    this.nameToField = {};
    fields.forEach(this.addField);
  }
  addField(field: FieldDecl) {
    if(field.name in this.nameToField) {
      throw new Error(`${field.name} already present in struct`);
    }
    this.fields.push(field);
    this.nameToField[field.name] = field;
  }
  str(name: string, length: number) : StructParser { 
    this.addField(new FieldDecl(name, FieldType.str, length)); 
    return this;
  }
  u8(name: string) : StructParser { 
    this.addField(new FieldDecl(name, FieldType.u8)); 
    return this;
  }
  u32(name: string) : StructParser { 
    this.addField(new FieldDecl(name, FieldType.u32)); 
    return this;
  }
  u64(name: string) : StructParser { 
    this.addField(new FieldDecl(name, FieldType.u64)); 
    return this;
  }
  u128(name: string) : StructParser { 
    this.addField(new FieldDecl(name, FieldType.u128)); 
    return this;
  }
  f64(name: string) : StructParser { 
    this.addField(new FieldDecl(name, FieldType.f64)); 
    return this;
  }

  getLength() : number {
    return this.fields.map(f=>f.getLength()).reduce((a,b)=>a+b, 0);
  }

  encode(object: any) : Buffer {
    const buffer = Buffer.alloc(this.getLength());
    let offset = 0;
    for(const field of this.fields) {
      const value = object[field.name];
      const encoder = TYPE_TO_ENCODER[field.type];
      encoder(value, buffer, offset);

      offset += field.getLength();
    }
    return buffer;
  }

  decode(buffer: Buffer, offset = 0) {
    const result: {[key:string]:any} = {};
    for(const field of this.fields) {
      const decoder = TYPE_TO_DECODER[field.type];
      result[field.name] = decoder(buffer, offset);
      offset += field.getLength();
    }
    return result;
  }
}