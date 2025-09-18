import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

import { CategoryBadge } from "./Badge/CategoryBadge";
import { MediumBlock, SmallBlock } from "./Block";
import { BlogCard } from "./Card";
import { Grid } from "./Grid";
import { H2, H4 } from "./Header";

const Articles = () => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );
  const [
    selectedCategories,
    setSelectedCategories,
  ] = useState<string[]>([]);

  const isCategorySelected = useCallback(
    (category: string) => selectedCategories.includes(category),
    [selectedCategories],
  );

  const handleCategoryClick = useCallback(
    (category: string) => {
      setSelectedCategories((prev) => {
        if (prev.includes(category)) {
          return prev.filter(c => c !== category);
        }

        return [
          ...prev,
          category,
        ];
      });
    },
    [],
  );

  const articles = useMemo(
    () => {
      return Object.values(t(
        "articles:articles",
        { returnObjects: true },
      ) as Record<string,
        { article:
        {
          category: string
          date: string
          description: string
          link: string
          linkLabel: string
          number: number
          readingTime: string
          title: string
        } }>)
        .map(article => article.article)
        .sort((a, b) => a.number - b.number)
        .reverse();
    },
    [t],
  );

  const categories = useMemo(
    () => {
      const allCategories = articles.map(article => article.category);

      return [...new Set(allCategories)];
    },
    [articles],
  );

  return (
    <MediumBlock>
      <H2>{t("blog:sections.articles.title")}</H2>

      <SmallBlock>
        <H4>{t("blog:sections.articles.categories.title")}</H4>
        <div className="flex flex-wrap gap-2">
          {
            categories.map(category => (
              <CategoryBadge
                isSelected={isCategorySelected(category)}
                key={category}
                onClick={
                  () => {
                    handleCategoryClick(category);
                  }
                }
              >
                {category}
              </CategoryBadge>
            ))
          }
        </div>
      </SmallBlock>

      <Grid columns={1}>
        {

          articles
            .filter(article => selectedCategories.length === 0 ||
              selectedCategories.includes(article.category))
            .map(article => (
              <BlogCard
                category={article.category}
                date={article.date}
                description={article.description}
                key={article.title}
                link={article.link}
                linkLabel={article.linkLabel}
                readingTime={article.readingTime}
                title={article.title}
              />
            ))
        }
      </Grid>
    </MediumBlock>
  );
};

export { Articles };
