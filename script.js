const apiKey = "3510d16ada2ff94ccc3afbb68f236061"; // << วาง API Key ที่คัดลอกมาที่นี่

const searchForm = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");
const weatherInfoContainer = document.querySelector("#weather-info-container");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีโหลดเมื่อกด submit
  const cityName = cityInput.value.trim(); // .trim() เพื่อตัดช่องว่างหน้า-หลัง
  localStorage.setItem("lastCity", cityName); // บันทึกชื่อเมืองใน localStorage
  if (cityName) {
    getWeather(cityName);
  } else {
    alert("กรุณาป้อนชื่อเมือง");
  }
});

async function getWeather(city) {
  // แสดงสถานะ Loading
  weatherInfoContainer.innerHTML = `<p class="loading">กำลังโหลดข้อมูล...</p>`;

  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=th
`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("ไม่พบข้อมูลเมืองนี้");
    }

    const data = await response.json();
    console.log(data); // ตรวจสอบข้อมูลที่ได้รับมา
    displayWeather(data);
  } catch (error) {
    weatherInfoContainer.innerHTML = `<p class="error">${error.message}</p>`;
  }
}

function displayWeather(data) {
  // ใช้ Destructuring เพื่อดึงค่าที่ต้องการออกจาก Object
  const { city, list } = data;
  const { name } = city;
  // เริ่มต้น HTML ด้วยชื่อเมือง
  let weatherHtml = `<h2>${name}</h2>`;

  // สร้าง container สำหรับรายการพยากรณ์อากาศเพื่อให้สามารถ scroll ได้
  weatherHtml += `<div class="forecast-list-container">`;

  // วนลูปแสดงข้อมูลพยากรณ์อากาศแต่ละช่วงเวลา
  for (const forecast of list) {
    const { dt_txt, main, weather } = forecast;
    const { temp, humidity } = main;
    const { description, icon } = weather[0];
    const formattedDate = new Date(dt_txt).toLocaleString("th-TH", { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

    // เพิ่ม HTML สำหรับแต่ละรายการพยากรณ์
    weatherHtml += `
      <div class="forecast-item">
        <h3>${formattedDate}</h3>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p class="temp">${temp.toFixed(1)}°C</p>
        <p>${description}</p>
        <p>ความชื้น: ${humidity}%</p>
      </div>
    `;
  }

  weatherHtml += `</div>`; // ปิด container

  // แสดงผลลัพธ์ใน container
  weatherInfoContainer.innerHTML = weatherHtml;
}

if(localStorage.getItem('lastCity')) {
    const lastCity = localStorage.getItem('lastCity');
    cityInput.value = lastCity; // เติมชื่อเมืองล่าสุดในช่อง input
    getWeather(lastCity); // ดึงข้อมูลสภาพอากาศของเมืองล่าสุดเมื่อโหลดหน้าเว็บ
}
