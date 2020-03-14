import { prompt } from "readline-sync";

class Stdin {
  public str: string = "";

  public set() {
    this.str = prompt({ prompt: "" });
  }
  public add(s: string) {
    this.str += s;
  }
  public scan() {
    this.add(prompt({ prompt: "" }));
  }
  public clear() {
    this.str = "";
  }
}

export const stdin = new Stdin();
