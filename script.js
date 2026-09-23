/* =========================================
   RBTDATA GIFT
   DATA ORDER SYSTEM
========================================= */


/* PACKAGE SIZES */
const packageSizes = [
  5,
  7,
  10,
  15,
  20,
  25,
  25,
  30,
  35,
  40,
  45,
  50,
  55,
  60,
  65,
  70,
  75
];


/* NETWORK PRICES */
const networks = {
  MTN: {
    pricePerGB: 250
  },

  Airtel: {
    pricePerGB: 200
  },

  Glo: {
    pricePerGB: 300
  },

  "9mobile": {
    pricePerGB: 300
  }
};


/* DOM */
const packageGrid = document.getElementById("packageGrid");

const networkButtons =
  document.querySelectorAll(".network-btn");


/* ORDER MODAL */
const orderModal =
  document.getElementById("orderModal");

const modalOverlay =
  document.getElementById("modalOverlay");

const closeModal =
  document.getElementById("closeModal");

const orderForm =
  document.getElementById("orderForm");

const pendingResult =
  document.getElementById("pendingResult");

const newOrderBtn =
  document.getElementById("newOrderBtn");

const formError =
  document.getElementById("formError");


/* SELECTED PACKAGE */
const selectedNetwork =
  document.getElementById("selectedNetwork");

const selectedPackage =
  document.getElementById("selectedPackage");

const selectedPrice =
  document.getElementById("selectedPrice");


/* PENDING */
const orderIdElement =
  document.getElementById("orderId");

const pendingPhone =
  document.getElementById("pendingPhone");

const pendingPackage =
  document.getElementById("pendingPackage");


/* FORM INPUTS */
const phoneNumber =
  document.getElementById("phoneNumber");

const customerName =
  document.getElementById("customerName");


/* CURRENT ORDER */
let currentOrder = {
  network: "",
  gb: 0,
  price: 0
};


/* =========================================
   GENERATE PACKAGES
========================================= */

function generatePackages(networkName) {

  packageGrid.innerHTML = "";

  const network = networks[networkName];

  packageSizes.forEach((gb, index) => {

    const price = gb * network.pricePerGB;

    const card = document.createElement("div");

    card.className = "package-card";

    card.innerHTML = `
      <span class="package-network">
        ${networkName}
      </span>

      <div class="package-size">
        ${gb}GB
      </div>

      <div class="package-price">
        ₦${price.toLocaleString()}
      </div>

      <button
        class="buy-package-btn"
        type="button"
        data-network="${networkName}"
        data-gb="${gb}"
        data-price="${price}"
      >
        Buy Now
      </button>
    `;

    packageGrid.appendChild(card);

  });

}


/* START WITH MTN */
generatePackages("MTN");


/* =========================================
   NETWORK SWITCHING
========================================= */

networkButtons.forEach(button => {

  button.addEventListener("click", () => {

    const networkName =
      button.dataset.network;

    networkButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    generatePackages(networkName);

  });

});


/* =========================================
   OPEN ORDER FORM
========================================= */

packageGrid.addEventListener("click", (event) => {

  const button =
    event.target.closest(".buy-package-btn");

  if (!button) return;


  const network =
    button.dataset.network;

  const gb =
    Number(button.dataset.gb);

  const price =
    Number(button.dataset.price);


  currentOrder = {
    network,
    gb,
    price
  };


  /* SHOW SELECTED DATA */

  selectedNetwork.textContent =
    network;

  selectedPackage.textContent =
    `${gb}GB`;

  selectedPrice.textContent =
    `₦${price.toLocaleString()}`;


  /* RESET FORM */

  orderForm.reset();

  formError.classList.remove("show");
  formError.textContent = "";


  /* SHOW FORM */

  orderForm.style.display = "block";

  pendingResult.classList.remove("show");


  /* OPEN MODAL */

  orderModal.classList.add("show");

  document.body.style.overflow = "hidden";

});


/* =========================================
   CLOSE MODAL
========================================= */

function closeOrderModal() {

  orderModal.classList.remove("show");

  document.body.style.overflow = "";

}


closeModal.addEventListener(
  "click",
  closeOrderModal
);


modalOverlay.addEventListener(
  "click",
  closeOrderModal
);


/* =========================================
   PHONE VALIDATION
========================================= */

function isValidPhone(phone) {

  return /^0[7-9][0-1][0-9]{8}$/.test(phone);

}


/* =========================================
   CREATE ORDER ID
========================================= */

function createOrderId() {

  const random =
    Math.floor(100000 + Math.random() * 900000);

  return `RBT${random}`;

}


/* =========================================
   SUBMIT ORDER
========================================= */

orderForm.addEventListener("submit", (event) => {

  event.preventDefault();


  const phone =
    phoneNumber.value.trim();

  const name =
    customerName.value.trim();


  /* CLEAR ERROR */

  formError.classList.remove("show");

  formError.textContent = "";


  /* NAME CHECK */

  if (name.length < 2) {

    formError.textContent =
      "Please enter your name.";

    formError.classList.add("show");

    return;

  }


  /* PHONE CHECK */

  if (!isValidPhone(phone)) {

    formError.textContent =
      "Please enter a valid Nigerian phone number.";

    formError.classList.add("show");

    return;

  }


  /* CREATE ORDER ID */

  const orderId =
    createOrderId();


  /* SAVE ORDER LOCALLY */

  const order = {

    id: orderId,

    name: name,

    phone: phone,

    network: currentOrder.network,

    package: `${currentOrder.gb}GB`,

    price: currentOrder.price,

    status: "Pending",

    createdAt: new Date().toISOString()

  };


  localStorage.setItem(
    `rbtdata-order-${orderId}`,
    JSON.stringify(order)
  );


  /* SHOW PENDING */

  orderIdElement.textContent =
    orderId;

  pendingPhone.textContent =
    phone;

  pendingPackage.textContent =
    `${currentOrder.network} ${currentOrder.gb}GB`;


  orderForm.style.display =
    "none";

  pendingResult.classList.add(
    "show"
  );

});


/* =========================================
   NEW ORDER
========================================= */

newOrderBtn.addEventListener(
  "click",
  () => {

    pendingResult.classList.remove(
      "show"
    );

    orderForm.style.display =
      "block";

    orderForm.reset();

  }
);


/* =========================================
   THEME
========================================= */

const themeToggle =
  document.getElementById("themeToggle");


const savedTheme =
  localStorage.getItem("rbtdata-theme");


if (savedTheme === "light") {

  document.body.classList.add(
    "light-mode"
  );

  themeToggle.textContent = "☀";

}


themeToggle.addEventListener(
  "click",
  () => {

    document.body.classList.toggle(
      "light-mode"
    );


    const lightMode =
      document.body.classList.contains(
        "light-mode"
      );


    themeToggle.textContent =
      lightMode ? "☀" : "☾";


    localStorage.setItem(
      "rbtdata-theme",
      lightMode ? "light" : "dark"
    );

  }
);


/* =========================================
   MOBILE MENU
========================================= */

const mobileMenuBtn =
  document.getElementById("mobileMenuBtn");

const mobileMenu =
  document.getElementById("mobileMenu");


mobileMenuBtn.addEventListener(
  "click",
  () => {

    const visible =
      mobileMenu.style.display === "flex";

    mobileMenu.style.display =
      visible ? "none" : "flex";

  }
);


mobileMenu.querySelectorAll("a").forEach(
  link => {

    link.addEventListener(
      "click",
      () => {

        mobileMenu.style.display =
          "none";

      }
    );

  }
);


/* =========================================
   COPY PAYMENT ACCOUNT
========================================= */

const copyAccount =
  document.getElementById("copyAccount");


copyAccount.addEventListener(
  "click",
  async () => {

    const accountNumber =
      "8991168761";

    try {

      await navigator.clipboard.writeText(
        accountNumber
      );

      copyAccount.textContent =
        "Copied!";

      setTimeout(() => {

        copyAccount.textContent =
          "Copy";

      }, 1500);

    } catch (error) {

      copyAccount.textContent =
        "Copy manually";

    }

  }
);


/* =========================================
   REFERRAL ID
========================================= */

let referralId =
  localStorage.getItem(
    "rbtdata-referral-id"
  );


if (!referralId) {

  referralId =
    "RBT" +
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

  localStorage.setItem(
    "rbtdata-referral-id",
    referralId
  );

}


const referralLink =
  document.getElementById(
    "referralLink"
  );


referralLink.value =
  window.location.origin +
  window.location.pathname +
  "?ref=" +
  referralId;


/* =========================================
   COPY REFERRAL
========================================= */

const copyReferral =
  document.getElementById(
    "copyReferral"
  );


copyReferral.addEventListener(
  "click",
  async () => {

    try {

      await navigator.clipboard.writeText(
        referralLink.value
      );

      copyReferral.textContent =
        "Copied!";

      setTimeout(() => {

        copyReferral.textContent =
          "Copy";

      }, 1500);

    } catch (error) {

      referralLink.select();

    }

  }
);


/* =========================================
   SHARE REFERRAL
========================================= */

const shareReferral =
  document.getElementById(
    "shareReferral"
  );


shareReferral.addEventListener(
  "click",
  async () => {

    const shareData = {

      title: "RBTDATA GIFT",

      text:
        "Get affordable data with RBTDATA GIFT.",

      url:
        referralLink.value

    };


    if (
      navigator.share
    ) {

      try {

        await navigator.share(
          shareData
        );

      } catch (error) {

        /* User cancelled share */

      }

    } else {

      try {

        await navigator.clipboard.writeText(
          referralLink.value
        );

        shareReferral.textContent =
          "Link Copied!";

        setTimeout(() => {

          shareReferral.textContent =
            "Share";

        }, 1500);

      } catch (error) {

        referralLink.select();

      }

    }

  }
);


/* =========================================
   REFERRAL PROGRESS
========================================= */

const referralProgress =
  document.getElementById(
    "referralProgress"
  );

const referralProgressText =
  document.getElementById(
    "referralProgressText"
  );

const successfulReferrals =
  document.getElementById(
    "successfulReferrals"
  );

const referralEarnings =
  document.getElementById(
    "referralEarnings"
  );

const referralEligibility =
  document.getElementById(
    "referralEligibility"
  );

const referralWallet =
  document.getElementById(
    "referralWallet"
  );


let referralCount =
  Number(
    localStorage.getItem(
      "rbtdata-referral-count"
    )
  ) || 0;


function updateReferralUI() {

  const count =
    Math.min(referralCount, 10);

  const percentage =
    (count / 10) * 100;

  const earnings =
    referralCount * 1340;


  referralProgress.style.width =
    `${percentage}%`;

  referralProgressText.textContent =
    `${count} / 10`;

  successfulReferrals.textContent =
    referralCount;

  referralEarnings.textContent =
    `₦${earnings.toLocaleString()}.00`;

  referralWallet.textContent =
    `₦${earnings.toLocaleString()}.00`;


  if (referralCount >= 10) {

    referralEligibility.textContent =
      "Eligible";

    referralEligibility.style.color =
      "var(--success)";

  } else {

    referralEligibility.textContent =
      "Not Eligible";

    referralEligibility.style.color =
      "var(--muted)";

  }

}


updateReferralUI();


/* =========================================
   REFERRAL URL
========================================= */

const urlParams =
  new URLSearchParams(
    window.location.search
  );


const referredBy =
  urlParams.get("ref");


if (referredBy) {

  localStorage.setItem(
    "rbtdata-referred-by",
    referredBy
  );

}


/* =========================================
   SOCIAL LINKS
========================================= */

document.querySelectorAll(
  ".social"
).forEach(link => {

  link.addEventListener(
    "click",
    event => {

      if (
        link.getAttribute("href") === "#"
      ) {

        event.preventDefault();

      }

    }
  );

});


/* =========================================
   CONSOLE
========================================= */

console.log(
  "RBTDATA GIFT loaded successfully."
);