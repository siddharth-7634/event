interface NewsItem {
    category: string;
    title: string;
    content: string;
    dateAndTime: string;
  }
  
  const data: NewsItem[] = [
    {
      category: "business",
      title: "Dollar gains on Greenspan speech",
      content:
        "The dollar has hit its highest level against the euro in almost three months after the Federal Reserve head said the US trade deficit is set to stabilise.  And Alan Greenspan highlighted the US government's willingness to curb spending and rising household savings as factors which may help to reduce it. In late trading in New York, the dollar reached 1.2871 against the euro, from 1.2974 on Thursday. Market concerns about the deficit has hit the greenback in recent months. On Friday, Federal Reserve chairman Mr Greenspan's speech in London ahead of the meeting of G7 finance ministers sent the dollar higher after it had earlier tumbled on the back of worse-than-expected US jobs data. \"I think the chairman's taking a much more sanguine view on the current account deficit than he's taken for some time,\" said Robert Sinche, head of currency strategy at Bank of America in New York. \"He's taking a longer-term view, laying out a set of conditions under which the current account deficit can improve this year and next.\"  Worries about the deficit concerns about China do, however, remain. China's currency remains pegged to the dollar and the US currency's sharp falls in recent months have therefore made Chinese export prices highly competitive. But calls for a shift in Beijing's policy have fallen on deaf ears, despite recent comments in a major Chinese newspaper that the \"time is ripe\" for a loosening of the peg. The G7 meeting is thought unlikely to produce any meaningful movement in Chinese policy. In the meantime, the US Federal Reserve's decision on 2 February to boost interest rates by a quarter of a point - the sixth such move in as many months - has opened up a differential with European rates. The half-point window, some believe, could be enough to keep US assets looking more attractive, and could help prop up the dollar. The recent falls have partly been the result of big budget deficits, as well as the US's yawning current account gap, both of which need to be funded by the buying of US bonds and assets by foreign firms and governments. The White House will announce its budget on Monday, and many commentators believe the deficit will remain at close to half a trillion dollars.",
      dateAndTime: "05/02/2023, 22:29:38",
    },
    {
      category: "business",
      title: "Yukos unit buyer faces loan claim",
      content:
           'The owners of embattled Russian oil giant Yukos are to ask the buyer of its former production unit to pay back a 900m (£479m) loan.  State-owned Rosneft bought the Yugansk unit for 9.3bn in a sale forced by Russia to part settle a 27.5bn tax claim against Yukos. Yukos\' owner Menatep Group says it will ask Rosneft to repay a loan that Yugansk had secured on its assets. Rosneft already faces a similar 540m repayment demand from foreign banks. Legal experts said Rosneft\'s purchase of Yugansk would include such obligations. "The pledged assets are with Rosneft, so it will have to pay real money to the creditors to avoid seizure of Yugansk assets," said Moscow-based US lawyer Jamie Firestone, who is not connected to the case. Menatep Group\'s managing director Tim Osborne told the Reuters news agency: "If they default, we will fight them where the rule of law exists under the international arbitration clauses of the credit."  Rosneft officials were unavailable for comment. But the company has said it intends to take action against Menatep to recover some of the tax claims and debts owed by Yugansk. Yukos had filed for bankruptcy protection in a US court in an attempt to prevent the forced sale of its main production arm. The sale went ahead in December and Yugansk was sold to a little-known shell company which in turn was bought by Rosneft. Yukos claims its downfall was punishment for the political ambitions of its founder Mikhail Khodorkovsky and has vowed to sue any participant in the sale.',
      dateAndTime: "12/04/2023, 05:59:13",
    },
  ];
  
  document.addEventListener('DOMContentLoaded', () => {
    const showMoreButton = <HTMLButtonElement>document.getElementById("show-more")  ;
    const newsCards = <HTMLDivElement>document.getElementById("news-cards");
    const searchInput = document.getElementById("search") as HTMLInputElement;
    const tags = document.querySelectorAll(".tag") as NodeListOf<HTMLElement>;
  
    if (!showMoreButton || !newsCards || !searchInput || !tags.length) {
      console.error("Required DOM elements not found");
      return;
    }
  
    let visibleNews: number = 7;
  
    const normalizeDate = (dateString: string): string => {
      const [datePart, timePart] = dateString.split(", ");
      const [day, month, year] = datePart.split("/");
      return `${year}-${month}-${day}T${timePart}`;
    };
  
    const sortedData: NewsItem[] = [...data].sort(
      (a, b) => new Date(normalizeDate(b.dateAndTime)).getTime() - new Date(normalizeDate(a.dateAndTime)).getTime()
    );
  
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleString("en-GB", { hour12: false });
    };
  
    const renderNews = (filteredData: NewsItem[], searchTerm: string = ""): void => {
      newsCards.innerHTML = "";
      const newsToShow = filteredData.slice(0, visibleNews);
      newsToShow.forEach((news) => {
        const card = document.createElement("div");
        card.classList.add("news-card");
        card.innerHTML = `
          <h3>${highlightText(news.title, searchTerm)}</h3>
          <p>${new Date(normalizeDate(news.dateAndTime)).toDateString()}</p>
          <p>${highlightText(news.content.slice(0, 500) + "...", searchTerm)}</p>
        `;
        newsCards.appendChild(card);
      });
    };
  
    const highlightText = (text: string, term: string): string => {
      if (!term) return text;
      const regex = new RegExp(`(${term})`, "gi");
      return text.replace(regex, `<span class="highlight">$1</span>`);
    };
  
    const filterNewsBySearch = (query: string): NewsItem[] =>
      sortedData.filter(
        (news) =>
          news.title.toLowerCase().includes(query.toLowerCase()) ||
          news.content.toLowerCase().includes(query.toLowerCase())
      );
  
    const debounce = <T extends (...args: any[]) => any>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
      let timeoutId: number | undefined;
      return (...args: Parameters<T>): void => {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => func(...args), delay);
      };
    };
  
    const handleSearch = debounce(() => {
      const query = searchInput.value.trim();
      const filteredData = filterNewsBySearch(query);
      renderNews(filteredData, query);
    }, 1000);
  
    const filterNewsByCategory = (category: string): NewsItem[] =>
      category === "all"
        ? sortedData
        : sortedData.filter((news) => news.category === category);
  
    const handleTagClick = (e: MouseEvent): void => {
      const target = e.target as HTMLElement;
      const category = target.dataset.category as string;
      tags.forEach((tag) => tag.classList.remove("active"));
      target.classList.add("active");
      const filteredData = filterNewsByCategory(category);
      renderNews(filteredData);
    };
  
    const handleShowMore = (): void => {
      visibleNews += 8;
      const activeTag = document.querySelector(".tag.active") as HTMLElement;
      if (!activeTag) return;
      const category = activeTag.dataset.category || 'all';
      const filteredData = filterNewsByCategory(category);
      renderNews(filteredData);
    };
  
    renderNews(sortedData);
  
    showMoreButton.addEventListener("click", handleShowMore);
    searchInput.addEventListener("input", handleSearch);
    tags.forEach((tag) => tag.addEventListener("click", handleTagClick as EventListener));
  });