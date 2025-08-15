import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

export const useUnreadCount = () => {
  const { unreadCountsByGroupId } = useSelector(
    (state: RootState) => state.chat
  );

  useEffect(() => {
    const totalUnread = Object.values(unreadCountsByGroupId).reduce(
      (sum, count) => sum + count,
      0
    );

    if (totalUnread > 0) {
      document.title = `(${totalUnread}) StudyBuddy`;
    } else {
      document.title = "StudyBuddy";
    }

    return () => {
      document.title = "StudyBuddy";
    };
  }, [unreadCountsByGroupId]);
};
