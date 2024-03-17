import { NextResponse } from "next/server";

const jsonData = [
  {
    "name": "森田 ひかる",
    "mail": "morita.hikaru@co.jp",
    "age": 22
  },
  {
    "name": "藤吉 夏鈴",
    "mail": "fujiyoshi.karin@co.jp",
    "age": 22
  },
  {
    "name": "大園 玲",
    "mail": "ozono.rei@co.jp",
    "age": 23
  },
  {
    "name": "山﨑 天",
    "mail": "yamasaki.ten@co.jp",
    "age": 18
  },
  {
    "name": "小島 凪紗",
    "mail": "kojima.nagisa@co.jp",
    "age": 18
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  return NextResponse.json(jsonData[Number(id)]);
}
