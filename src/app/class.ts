"use strict";

/**
 *
 */
class Person {

  constructor(private name: string = 'contact', public extention = "!!!!") {

  }

  /**
   *
   */
  public say(): void {
    alert(`Hello Abai, 1st ${this.name}${this.extention}`);
  }
}

export default Person;