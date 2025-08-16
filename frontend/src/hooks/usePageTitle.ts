import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_TITLE = "StudyBuddy";

const routeTitles: Record<string, string> = {
  "/": BASE_TITLE,
  "/courses": `${BASE_TITLE} - All Courses`,
  "/tutors": `${BASE_TITLE} - Find Tutors`,
  "/groups": `${BASE_TITLE} - Study Groups`,
  "/groups/my": `${BASE_TITLE} - My Groups`,
  "/groups/chat": `${BASE_TITLE} - Chat`,
  "/about": `${BASE_TITLE} - About Us`,
  "/contact": `${BASE_TITLE} - Contact Us`,
  "/profile": `${BASE_TITLE} - My Profile`,
  "/checkout": `${BASE_TITLE} - Checkout`,
  "/learning": `${BASE_TITLE} - My Learning`,
  "/code-editor": `${BASE_TITLE} - Code Editor`,
};

const getDynamicTitle = (pathname: string): string => {
  if (pathname.match(/^\/courses\/[^/]+$/)) {
    return `${BASE_TITLE} - Course Details`;
  }

  if (pathname.match(/^\/tutors\/[^/]+$/)) {
    return `${BASE_TITLE} - Tutor Profile`;
  }

  if (pathname.match(/^\/groups\/[^/]+$/) && !pathname.includes("/chat")) {
    return `${BASE_TITLE} - Group Details`;
  }

  if (pathname.match(/^\/learning\/course\/[^/]+$/)) {
    return `${BASE_TITLE} - Learning`;
  }

  return BASE_TITLE;
};

export const usePageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;

    let title = routeTitles[pathname];

    if (!title) {
      title = getDynamicTitle(pathname);
    }

    document.title = title;
  }, [location.pathname]);
};

export const useCustomPageTitle = (customTitle?: string) => {
  const location = useLocation();

  useEffect(() => {
    if (customTitle && customTitle.trim()) {
      document.title = `${BASE_TITLE} - ${customTitle}`;
    } else {
      const pathname = location.pathname;
      let title = routeTitles[pathname];

      if (!title) {
        title = getDynamicTitle(pathname);
      }

      document.title = title;
    }
  }, [location.pathname, customTitle]);
};
