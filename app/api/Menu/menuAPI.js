const getMenu = async () => {
  const menu = await fetch(
    "https://na86ywpjdb.execute-api.us-east-1.amazonaws.com/test/menu",
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }
  );
  const data = await menu.json();
  return data;
};

const postMenu = async (event) => {
  const newItem = await fetch(
    "https://na86ywpjdb.execute-api.us-east-1.amazonaws.com/test/menu",
    {
      moethod: "POST",
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
