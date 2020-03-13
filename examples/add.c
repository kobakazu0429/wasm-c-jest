#include <stdio.h>

int add(int a, int b)
{
  return a + b;
}

int main()
{
  int a = 0;
  int b = 0;
  scanf("%d", &a);
  scanf("%d", &b);
  printf("%d + %d = %d\n", a, b, add(a, b));
  return 0;
}
