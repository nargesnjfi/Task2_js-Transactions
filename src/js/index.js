const searchInput = document.getElementById("searchrefid");
const titlebox = document.getElementById("searchbox");
const sortpriceBtn = document.getElementById("sortpricebtn");
const sortdateBtn = document.getElementById("sortdatebtn");
titlebox.style.display = "none";
searchInput.value = "";

let order = "asc";
//*?show transactions  */
async function showTransactions() {
  const showTransactionsBtn = document.getElementById("showTransactionsBtn");
  showTransactionsBtn.style.display = "none";

  titlebox.style.display = "flex";
  try {
    const response = await axios.get("http://localhost:3000/transactions");
    const transactions = response.data;

    displayResults(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
}

//?render to dom
function displayResults(data) {
  const transactionsTable = document.getElementById("transactionsTable");
  const transactionsBody = document.getElementById("transactionsBody");
  transactionsTable.style.display = "table";
  data.forEach((transaction) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${numberToPersian(transaction.id)}</td>
          <td>${transaction.type}</td>
          <td>${transaction.price}</td>
          <td>${transaction.refId}</td>
          <td>${new persianDate(transaction.date)
            .toLocale("fa")
            .format("YYYY/MM/DD ساعت HH:mm")}</td>
        
          `;

    transactionsBody.appendChild(row);
    const tds = row.querySelectorAll("td");

    tds.forEach((td) => {
      if (td.textContent.trim() === "افزایش اعتبار") {
        td.style.color = "green";
      } else if (td.textContent.trim() === "برداشت از حساب") {
        td.style.color = "red";
      }
    });
  });
}

//?click backspace and load all data */
searchInput.addEventListener("keydown", async (e) => {
  if (e.key === "Backspace" && searchInput.value.trim() == "") {
    try {
      const response = await axios.get(`http://localhost:3000/transactions`);
      const transactions = response.data;
      console.log(transactions);
      transactionsBody.innerHTML = "";
      displayResults(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }
});

//?search transactions with refid */
searchInput.addEventListener("input", async (e) => {
  const query = e.target.value;
  try {
    const response = await axios.get(
      `http://localhost:3000/transactions?refId_like=${query}`
    );
    const transactions = response.data;
    console.log(transactions);
    transactionsBody.innerHTML = "";
    displayResults(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
});

//?convert to persian */
function numberToPersian(number) {
  const persian = {
    0: "۰",
    1: "۱",
    2: "۲",
    3: "۳",
    4: "۴",
    5: "۵",
    6: "۶",
    7: "۷",
    8: "۸",
    9: "۹",
  };
  number = number.toString().split("");
  let persianNumber = "";
  for (let i = 0; i < number.length; i++) {
    persianNumber += persian[number[i]];
  }
  return persianNumber;
}

//*?sort by price */
sortpriceBtn.addEventListener("click", async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/transactions?_sort=price&_order=${order}`
    );
    transactionsBody.innerHTML = "";
    const transactions = response.data;
    if (order === "asc") {
      sortpriceBtn.classList.remove("asc");
      sortpriceBtn.classList.add("rotate180");
      sortpriceBtn.classList.add("des");
      order = "desc";
    } else {
      sortpriceBtn.classList.remove("des");
      sortpriceBtn.classList.remove("rotate180");
      sortpriceBtn.classList.add("asc");
      order = "asc";
    }

    displayResults(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
});

//*?sort by date */
sortdateBtn.addEventListener("click", async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/transactions?_sort=date&_order=${order}`
    );

    transactionsBody.innerHTML = "";
    const transactions = response.data;

    if (order === "asc") {
      sortdateBtn.classList.remove("asc");
      sortdateBtn.classList.add("rotate180");
      sortdateBtn.classList.add("des");
      order = "desc";
    } else {
      sortdateBtn.classList.remove("des");
      sortdateBtn.classList.remove("rotate180");
      sortdateBtn.classList.add("asc");
      order = "asc";
    }

    displayResults(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
});
