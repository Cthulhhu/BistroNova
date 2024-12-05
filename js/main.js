"use strict";

// Main initialization when document is ready
$(document).ready(function() {
    initializeSlideshow();
    initializeMenuTabs();
    loadDailySpecials();
    initializeReservationSystem();
    initializePreferences();
    loadUserPreferences();
});

// Slideshow Implementation
function initializeSlideshow() {
    const slides = [
        { image: "/api/placeholder/1280/500", caption: "Welcome to Bistro Nova" },
        { image: "/api/placeholder/1280/500", caption: "Experience Modern Italian Cuisine" },
        { image: "/api/placeholder/1280/500", caption: "Crafted with Passion" }
    ];

    const slideshow = $(".slideshow-container");
    slideshow.empty();

    // Create slideshow structure
    slides.forEach((slide, index) => {
        const slideDiv = $("<div>")
            .addClass("slide")
            .css({
                display: index === 0 ? "block" : "none",
                position: "relative",
                height: "100%"
            });

        const img = $("<img>")
            .attr("src", slide.image)
            .attr("alt", slide.caption)
            .css({
                width: "100%",
                height: "100%",
                objectFit: "cover"
            });

        const caption = $("<div>")
            .addClass("slide-caption")
            .text(slide.caption)
            .css({
                position: "absolute",
                bottom: "20px",
                left: "0",
                right: "0",
                textAlign: "center",
                color: "white",
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: "15px"
            });

        slideDiv.append(img, caption);
        slideshow.append(slideDiv);
    });

    // Slideshow animation
    let currentSlide = 0;
    setInterval(() => {
        const slides = $(".slide");
        $(slides[currentSlide]).fadeOut(1000);
        currentSlide = (currentSlide + 1) % slides.length;
        $(slides[currentSlide]).fadeIn(1000);
    }, 5000);
}

// Menu Tabs Implementation
function initializeMenuTabs() {
    const menuCategories = [
        {
            name: "Antipasti",
            items: [
                { name: "Bruschetta", price: "12", description: "Grilled bread with tomatoes and basil" },
                { name: "Caprese", price: "14", description: "Fresh mozzarella with tomatoes and basil" }
            ]
        },
        {
            name: "Pasta",
            items: [
                { name: "Spaghetti Carbonara", price: "24", description: "Classic carbonara with pancetta" },
                { name: "Penne Arrabbiata", price: "22", description: "Spicy tomato sauce with garlic" }
            ]
        },
        {
            name: "Secondi",
            items: [
                { name: "Bistecca Fiorentina", price: "45", description: "Grilled T-bone steak" },
                { name: "Salmon al Limone", price: "32", description: "Grilled salmon with lemon sauce" }
            ]
        }
    ];

    // Create tabs structure
    const tabsList = $("<ul>");
    const tabPanels = $("<div>");

    menuCategories.forEach((category, index) => {
        // Add tab
        const tabLi = $("<li>");
        const tabLink = $("<a>")
            .attr("href", `#menu-${index}`)
            .text(category.name);
        tabLi.append(tabLink);
        tabsList.append(tabLi);

        // Add panel
        const panel = $("<div>")
            .attr("id", `menu-${index}`);
        
        const menuItems = category.items.map(item => `
            <div class="menu-item">
                <h3>${item.name} - $${item.price}</h3>
                <p>${item.description}</p>
            </div>
        `).join("");

        panel.html(menuItems);
        tabPanels.append(panel);
    });

    $("#menu-tabs")
        .append(tabsList)
        .append(tabPanels)
        .tabs();
}

// Daily Specials AJAX Implementation
function loadDailySpecials() {
    // In a real implementation, this would be an API endpoint
    // For this demo, we'll use the JSON file we created
    $.ajax({
        url: "data/specials.json",
        method: "GET",
        success: function(data) {
            const specialsContainer = $(".specials-container");
            specialsContainer.empty();

            data.specials.forEach(special => {
                const specialCard = $(`
                    <div class="special-card">
                        <img src="${special.image}" alt="${special.name}">
                        <h3>${special.name}</h3>
                        <p>${special.description}</p>
                        <p class="price">$${special.price.toFixed(2)}</p>
                        ${special.dietary.length ? `
                            <div class="dietary-tags">
                                ${special.dietary.map(tag => `<span class="dietary-tag">${tag}</span>`).join("")}
                            </div>
                        ` : ""}
                    </div>
                `);
                specialsContainer.append(specialCard);
            });
        },
        error: function(xhr, status, error) {
            console.error("Error loading specials:", error);
            $(".specials-container").html("<p>Unable to load daily specials. Please check back later.</p>");
        }
    });
}

// Reservation System Implementation
function initializeReservationSystem() {
    // Initialize datepicker
    $("#reservation-date").datepicker({
        minDate: 0,
        maxDate: "+2M",
        beforeShowDay: function(date) {
            // Disable Mondays (restaurant closed)
            return [date.getDay() !== 1, ""];
        }
    });

    // Handle form submission
    $("#reserve-table").on("submit", function(e) {
        e.preventDefault();
        
        const reservationData = {
            date: $("#reservation-date").val(),
            time: $("#reservation-time").val(),
            partySize: $("#party-size").val(),
            name: $("#customer-name").val(),
            email: $("#customer-email").val(),
            phone: $("#customer-phone").val(),
            specialRequests: $("#special-requests").val()
        };

        // Store reservation in localStorage for demo purposes
        // In a real app, this would be sent to a server
        const reservations = JSON.parse(localStorage.getItem("reservations") || "[]");
        reservations.push(reservationData);
        localStorage.setItem("reservations", JSON.stringify(reservations));

        // Show confirmation dialog
        $("<div>")
            .attr("title", "Reservation Confirmed")
            .html(`
                <p>Thank you for your reservation, ${reservationData.name}!</p>
                <p>We'll see you on ${reservationData.date} at ${reservationData.time}.</p>
            `)
            .dialog({
                modal: true,
                buttons: {
                    OK: function() {
                        $(this).dialog("close");
                        $("#reserve-table")[0].reset();
                    }
                }
            });
    });
}

// User Preferences Implementation
function initializePreferences() {
    // Initialize spice preference slider
    $("#spice-slider").slider({
        min: 1,
        max: 5,
        value: 3,
        slide: function(event, ui) {
            $("#spice-level").text(ui.value);
        }
    });

    // Handle preferences form submission
    $("#preferences-form").on("submit", function(e) {
        e.preventDefault();
        
        const preferences = {
            dietary: $("#dietary-restrictions").val(),
            spiceLevel: $("#spice-slider").slider("value")
        };

        // Save to localStorage
        localStorage.setItem("userPreferences", JSON.stringify(preferences));

        // Show confirmation
        $("<div>")
            .attr("title", "Preferences Saved")
            .html("<p>Your dining preferences have been saved!</p>")
            .dialog({
                modal: true,
                buttons: {
                    OK: function() {
                        $(this).dialog("close");
                    }
                }
            });
    });
}

// Load saved preferences from localStorage
function loadUserPreferences() {
    const savedPreferences = localStorage.getItem("userPreferences");
    if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        
        // Set dietary restrictions
        $("#dietary-restrictions").val(preferences.dietary);
        
        // Set spice level
        $("#spice-slider").slider("value", preferences.spiceLevel);
    }
}