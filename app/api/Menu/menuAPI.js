const getMenu = async () => {
  const menu = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}menu`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  const data = await menu.json();
  return data;
};

const postMenu = async (event) => {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();

  if (!idToken) {
    throw new Error("User is not authenticated — ID token missing");
  }

  const newItem = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}menu`,
    {
      method: "POST",
      body: {
        name: event.name,
        price: event.price,
      },
    }
  );

  if (newItem.response === 200)
    return {
      statusCode: newItem.response,
      body: { message: "Item posted sucesfully " },
    };
  else {
    return {
      statusCode: newItem.response,
      body: { message: "Error while trying to post new item." },
    };
  }
};

export { getMenu, postMenu };
