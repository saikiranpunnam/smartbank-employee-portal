const API_URL = "https://api.echova.in/api";

document.getElementById("empForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: name.value,
    email: email.value,
    role: role.value
  };

  await fetch(`${API_URL}/employees`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });

  alert("✅ Employee Added!");
  loadEmployees();
});

async function loadEmployees() {
  const res = await fetch(`${API_URL}/employees`);
  const data = await res.json();

  const table = document.querySelector("#empTable tbody");
  table.innerHTML = "";

  data.forEach(emp => {
    table.innerHTML += `
      <tr>
        <td>${emp.name}</td>
        <td>${emp.email}</td>
        <td>${emp.role}</td>
      </tr>`;
  });
}

loadEmployees();
