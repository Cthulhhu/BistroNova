"use strict";

$(document).ready(function() {
    initializeMenuTabs();
    initializeGallery();
    loadMenuItems();
    initializeEventListeners();
});

function initializeMenuTabs() {
    $("#menu-tabs").tabs({
        show: { effect: "fade", duration: 400 },
        hide: { effect: "fade", duration: 400 }
    });
}

// New Gallery Initialization
function initializeGallery() {
    const galleryImages = [
        'gallery-1.jpg',
        'gallery-2.jpg',
        'gallery-3.jpg',
        'gallery-4.jpg',
        'gallery-5.jpg'
    ];

    const slider = $('.gallery-slider');
    
    galleryImages.forEach(image => {
        slider.append(`<div><img src="images/${image}" alt="Gallery Image" loading="lazy"></div>`);
    });

    slider.slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        adaptiveHeight: true,
        prevArrow: '<button type="button" class="slick-prev">Previous</button>',
        nextArrow: '<button type="button" class="slick-next">Next</button>'
    });
}

function loadMenuItems() {
    $('.menu-section').append('<div class="loading">Loading...</div>');
    
    $.ajax({
        url: 'data/menu.json',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            $('.loading').remove();
            populateMenuSection('appetizers', data.appetizers);
            populateMenuSection('main-courses', data.mainCourses);
            populateMenuSection('desserts', data.desserts);
        },
        error: function(xhr, status, error) {
            console.error('Error loading menu items:', error);
            showErrorMessage('menu-tabs', 'Unable to load menu items. Please try again later.');
        }
    });
}

function populateMenuSection(sectionId, items) {
    const section = $(`#${sectionId}`);
    section.empty();
    
    const wrapper = $('<div class="menu-grid"></div>');
    
    items.forEach(item => {
        const menuItem = `
            <div class="menu-item">
                <div class="menu-item-image">
                    <img src="images/${item.image}" 
                         alt="${item.name}"
                         loading="lazy">
                </div>
                <div class="menu-item-details">
                    <h3>${item.name}</h3>
                    <p class="arabic-name">${item.arabicName}</p>
                    <p class="description">${item.description}</p>
                    <span class="price">$${item.price.toFixed(2)}</span>
                    <button class="order-button" data-item="${item.name}">Order now</button>
                </div>
            </div>
        `;
        
        wrapper.append(menuItem);
    });
    
    section.append(wrapper);
}

function initializeEventListeners() {
    // Smooth scrolling
    $('nav a').click(function(e) {
        e.preventDefault();
        const target = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(target).offset().top - 80
        }, 800);
    });

    // Contact form
    $('#contact-form').submit(function(e) {
        e.preventDefault();
        const name = $('#name').val();
        showSuccessMessage(`Thank you ${name}, we'll get back to you soon!`);
        this.reset();
    });

    // Order buttons
    $(document).on('click', '.order-button', function() {
        const itemName = $(this).data('item');
        showSuccessMessage(`"${itemName}" has been added to your order!`);
    });
}

// Utility Functions
function showSuccessMessage(message) {
    const successMessage = $('<div>')
        .addClass('success-message')
        .text(message)
        .css({
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'var(--green)',
            color: 'white',
            padding: '1rem',
            borderRadius: '5px',
            zIndex: 9999,
            opacity: 0
        });

    $('body').append(successMessage);

    successMessage.animate({ opacity: 1 }, 300);

    setTimeout(() => {
        successMessage.animate({ opacity: 0 }, 300, function() {
            $(this).remove();
        });
    }, 3000);
}

function showErrorMessage(elementId, message) {
    const errorDiv = $('<div>')
        .addClass('error-message')
        .text(message);

    $(`#${elementId}`).prepend(errorDiv);

    setTimeout(() => {
        errorDiv.fadeOut(300, function() {
            $(this).remove();
        });
    }, 3000);
}