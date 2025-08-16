const formatFullName = (
  firstName: string,
  lastName?: string | null
): string => {
  if (!firstName) return "";

  if (!lastName || lastName.trim() === "") {
    return firstName.trim();
  }

  return `${firstName.trim()} ${lastName.trim()}`;
};

const getDisplayName = (
  firstName: string,
  lastName?: string | null
): string => {
  if (!firstName) return "";

  if (!lastName || lastName.trim() === "") {
    return firstName.trim();
  }

  return `${firstName.trim()} ${lastName.trim()}`;
};

export { formatFullName, getDisplayName };
