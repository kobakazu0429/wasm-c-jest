// https://hackmd.io/zgucKrShTcWE8NTcJJJ8jA

#include <stdio.h>

int main()
{
  int w1 = 0;
  int h1 = 0;
  int w2 = 0;
  int h2 = 0;

  scanf("%d", &w1);
  scanf("%d", &h1);
  scanf("%d", &w2);
  scanf("%d", &h2);

  if (h1 == h2 || h1 == w2 || h2 == w1)
    printf("YES\n");
  else
    printf("NO\n");
  return 0;
}
