// Fungsi untuk memperbarui statistik di halaman
function updateStatistics(data) {
  const totalBalita = data.reduce((sum, item) => {
    const jumlahBalita = parseInt(item.jumlah_balita) || 0;
    const jumlahPendek = parseInt(item.jumlah_pendek) || 0;
    const jumlahKurus = parseInt(item.jumlah_kurus) || 0;
    return sum + jumlahBalita + jumlahPendek + jumlahKurus;
  }, 0);

  const totalGiziKurang = data.reduce(
    (acc, curr) => acc + (parseInt(curr.jumlah_balita) || 0),
    0
  );
  const totalBalitaPendek = data.reduce(
    (acc, curr) => acc + (parseInt(curr.jumlah_pendek) || 0),
    0
  );
  const totalBalitaKurus = data.reduce(
    (acc, curr) => acc + (parseInt(curr.jumlah_kurus) || 0),
    0
  );

  document.getElementById("total-balita").innerText = `${totalBalita}`;
  document.getElementById("total-gizi-kurang").innerText = `${totalGiziKurang}`;
  document.getElementById("total-pendek").innerText = `${totalBalitaPendek}`;
  document.getElementById("total-kurus").innerText = `${totalBalitaKurus}`;
}

function loadData() {
  fetch("Data_GiziBuruk.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      // Tampilkan semua data secara default
      updateStatistics(data);

      // Tambahkan event listener untuk form
      document
        .getElementById("filter-form")
        .addEventListener("submit", function (event) {
          event.preventDefault(); // Mencegah pengiriman form
          //Filter data berdasarkan input
          const kabupatenkota = document.getElementById("KOTA").value;
          const pilihTahun = document.getElementById("tahun").value;

          const filteredData = data.filter((item) => {
            const tahunCondition = pilihTahun
              ? item.tahun === pilihTahun
              : true;
            const kabkotCondition = kabupatenkota
              ? item.nama_kabupaten_kota === kabupatenkota
              : true;

            return tahunCondition && (kabupatenkota === "" || kabkotCondition);
          });

          // Update statistik berdasarkan data yang difilter
          updateStatistics(filteredData);
        });
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
}

// Panggil fungsi loadData saat halaman dimuat
document.addEventListener("DOMContentLoaded", loadData);

//Chart Jumlah Balita Gizi Buruk
const chartGiziBuruk = document.getElementById("GiziBurukChart");

fetch("FileJSON/Jumlah_BalitaGiziKurang.json")
  .then(function (response) {
    if (response.ok == true) {
      return response.json();
    }
  })
  .then(function (data) {
    var tahun = [];
    var kategoribalita = [];
    var jmlkategori = [];
    var jmlbalita1 = [];
    var jmlbalita2 = [];

    data.forEach((element) => {
      tahun.push(element.tahun);
      kategoribalita.push(element.kategori_gizi_buruk);
      jmlkategori.push(element.jumlah_balita);
      jmlbalita1.push(element.jumlah_balita1);
      jmlbalita2.push(element.jumlah_balita2);
    });
    var objChart = {
      t_ahun: tahun,
      jml_ketegori: jmlkategori,
      kategori_balita: kategoribalita,
      jml_ketegori_1: jmlbalita1,
      jml_ketegori_2: jmlbalita2,
    };
    createChartGiziBuruk(objChart, "line");
  });

function createChartGiziBuruk(arrgiziburuk, type) {
  new Chart(chartGiziBuruk, {
    type: type,
    data: {
      labels: arrgiziburuk.t_ahun,
      datasets: [
        {
          label: "Balita Gizi Kurang",
          data: arrgiziburuk.jml_ketegori_2,
          borderWidth: 2,
        },
        {
          label: "Balita Kurus",
          data: arrgiziburuk.jml_ketegori_1,
          borderWidth: 2,
        },
        {
          label: "Balita Pendek",
          data: arrgiziburuk.jml_ketegori,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "JUMLAH BALITA GIZI BURUK DI JAWA BARAT",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

//Chart Top 10 Balita Gizi Kurang
const chartGiziKurang = document.getElementById("GiziKurangChart");
let chartInstanceGiziKurang;

function fetchDataAndUpdateChartGiziKurang(year) {
  fetch("FileJSON/Balita_GiziKurang.json")
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok");
    })
    .then(function (data) {
      //Filter berdasarkan tahun
      const filtereddata = data.filter((item) => item.tahun === year);

      // Ambil hanya 10 data pertama
      const limiteddata = filtereddata.slice(0, 10);

      var arrkabupatenkota = [];
      var arrjmlbalita = [];
      var arrpersentase = [];

      limiteddata.forEach((element) => {
        arrkabupatenkota.push(element.nama_kabupaten_kota);
        arrjmlbalita.push(element.jumlah_balita);
        arrpersentase.push(element.persentase);
      });

      var objChart = {
        kabupaten_kota: arrkabupatenkota,
        jml_balita: arrjmlbalita,
        persentage: arrpersentase,
      };

      // Hapus chart yang sudah ada jika ada
      if (chartInstanceGiziKurang) {
        chartInstanceGiziKurang.destroy();
      }

      // Buat chart baru
      chartInstanceGiziKurang = createChartBalitaGiziKurang(objChart, "pie");
    })
    .catch(function (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
}

function createChartBalitaGiziKurang(arrgizikurang, type) {
  return new Chart(chartGiziKurang, {
    type: type,
    data: {
      labels: arrgizikurang.kabupaten_kota,
      datasets: [
        {
          data: arrgizikurang.jml_balita,
          backgroundColor: [
            "rgb(95, 158, 160)",
            "rgb(199, 21, 133)",
            "rgb(238, 232, 170)",
            "rgb(244, 164, 95)",
            "rgb(250, 128, 114)",
            "rgb(252, 182, 193)",
            "rgb(135, 206, 250)",
            "rgb(160,82,45)",
            "rgb(219, 112, 147)",
            "rgb(102, 51, 153)",
          ],
          hoverOffset: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "TOP 10 BALITA GIZI KURANG DI JAWA BARAT",
        },
        legend: {
          position: "right",
        
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const index = context.dataIndex;
              const totalBalita = arrgizikurang.jml_balita[index];
              const percentages = arrgizikurang.persentage[index];
              return `${totalBalita} (${percentages})`;
            },
          },
        },
        datalabels: {
          formatter: function (value, context) {
            const index = context.dataIndex;
            const percentages = arrgizikurang.persentage[index];
            return ` (${percentages})`;
          },
          color: "#fff",
          anchor: "center",
          align: "end",
          font: {
            weight: "bold",
            size: "8",
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
}
// Fungsi untuk memperbarui chart berdasarkan tahun yang dipilih
function updateChartGiziKurang() {
  const selectedYear = document.getElementById("year-Select").value;
  fetchDataAndUpdateChartGiziKurang(selectedYear);
}

// Inisialisasi chart dengan tahun default
document.addEventListener("DOMContentLoaded", function () {
  updateChartGiziKurang();
});

//Chart Top 10 Balita Kurus
const chartKurus = document.getElementById("KurusChart");
let chartInstanceKurus; // Untuk menyimpan instance chart

function fetchDataAndUpdateChartKurus(year) {
  fetch("FileJSON/BalitaKurus.json")
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok");
    })
    .then(function (data) {
      // Filter data berdasarkan tahun
      const filteredData = data.filter((item) => item.Tahun === year);

      // Ambil hanya 10 data pertama
      const limited = filteredData.slice(0, 10);
      var arrkabupatenkota = [];
      var arrtotalbalita = [];

      limited.forEach((element) => {
        arrkabupatenkota.push(element.kabupaten_kota);
        arrtotalbalita.push(element.Balita);
      });

      var objChart = {
        kab_kota: arrkabupatenkota,
        total_balita: arrtotalbalita,
      };

      // Hapus chart yang sudah ada jika ada
      if (chartInstanceKurus) {
        chartInstanceKurus.destroy();
      }

      // Buat chart baru
      chartInstanceKurus = createChartBalitaKurus(objChart, "bar");
    })
    .catch(function (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
}

function createChartBalitaKurus(arrbayi, type) {
  return new Chart(chartKurus, {
    type: type,
    data: {
      labels: arrbayi.kab_kota,
      datasets: [
        {
          label: "Balita",
          data: arrbayi.total_balita,
          borderWidth: 1,
          backgroundColor: ["rgb(219,112,147)"],
        },
      ],
    },
    options: {
      responsive: true,
      indexAxis: "y",
      plugins: {
        title: {
          display: true,
          text: "TOP 10 BALITA KURUS DI JAWA BARAT",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Fungsi untuk memperbarui chart berdasarkan tahun yang dipilih
function updateChartKurus() {
  const selectedYear = document.getElementById("yearSelect").value;
  fetchDataAndUpdateChartKurus(selectedYear);
}

// Inisialisasi chart dengan tahun default
document.addEventListener("DOMContentLoaded", function () {
  updateChartKurus();
});

//Chart Top 10 Balita Pendek
const chartPendek = document.getElementById("PendekChart");
let chartInstancePendek; // Untuk menyimpan instance chart

function fetchDataAndUpdateChartPendek(year) {
  fetch("FileJSON/BalitaPendek.json")
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok");
    })
    .then(function (data) {
      // Filter data berdasarkan tahun
      const filteredata = data.filter((item) => item.tahun === year);

      // Ambil hanya 10 data pertama
      const limited = filteredata.slice(0, 10);
      var arrnamakota = [];
      var arrjumlahbalita = [];

      limited.forEach((element) => {
        arrnamakota.push(element.nama_kabupaten_kota);
        arrjumlahbalita.push(element.Balita);
      });

      var objChart = {
        nama_kota: arrnamakota,
        jumlah_balita: arrjumlahbalita,
      };

      // Hapus chart yang sudah ada jika ada
      if (chartInstancePendek) {
        chartInstancePendek.destroy();
      }

      // Buat chart baru
      chartInstancePendek = createChartBalitaPendek(objChart, "bar");
    })
    .catch(function (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
}

function createChartBalitaPendek(arrPassed, type) {
  return new Chart(chartPendek, {
    type: type,
    data: {
      labels: arrPassed.nama_kota,
      datasets: [
        {
          label: "Balita",
          data: arrPassed.jumlah_balita,
          borderWidth: 1,
          backgroundColor: "rgb(219,112,147)",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "TOP 10 BALITA PENDEK DI JAWA BARAT",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Fungsi untuk memperbarui chart berdasarkan tahun yang dipilih
function updateChartPendek() {
  const selectedYear = document.getElementById("yearselect").value;
  fetchDataAndUpdateChartPendek(selectedYear);
}

// Inisialisasi chart dengan tahun default
document.addEventListener("DOMContentLoaded", function () {
  updateChartPendek();
});
