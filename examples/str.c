#include <stdio.h>

unsigned int getptr()
{
  char *str = "Hello World!";
  return (unsigned int)(&str);
}

int main()
{
  float a = 0.52;
  // float b = 0.41;
  // float c = a * 100 + b * 100;
  // printf("%d\n", (int)c);
  printf("%f\n", a);
  return 0;
}
