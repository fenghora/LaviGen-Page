var txt2pano_in_items = [
    { image: "00.jpg", prompt: "A modern, spacious kitchen with a large island, stainless steel appliances, and a combination of wood and marble finishes."},
    { image: "01.jpg", prompt: "A modern interior space with a combination of open areas, wooden lattice panels, and large glass doors leading to an outdoor patio."},
    { image: "02.jpg", prompt: "A spacious, well-lit kitchen and dining area with large windows offering a view of a backyard and greenery."},
    { image: "03.jpg", prompt: "A luxurious, modern bathroom with a large black bathtub, double sinks, and a spacious walk-in shower, all set against a backdrop of elegant decor and natural light."},
    { image: "04.jpg", prompt: "A spacious, modern living room with wooden flooring, contemporary furniture, and large windows allowing natural light to fill the room."},
    // { image: "05.jpg", prompt: "A spacious, modern bedroom with a large bed, a glass-enclosed bathroom, and a well-lit, open-plan design featuring stone columns and wooden flooring."},
    { image: "06.jpg", prompt: "A modern, spacious bathroom with a large mirror, double sinks, and a walk-in shower, all set against a backdrop of large windows and natural light."},
    // { image: "07.jpg", prompt: "A spacious, modern room with wooden walls, a curved bench, and various exercise equipment, including balls and a treadmill."},
    { image: "08.jpg", prompt: "A modern, spacious interior with a dining area, a living room, and a hallway, featuring contemporary furniture, decorative elements, and large windows that allow natural light to fill the space."},
    // { image: "09.jpg", prompt: "A spacious, modern bathroom with a large bathtub, multiple mirrors, and a walk-in shower, all set against a backdrop of wooden flooring and neutral-colored walls."},
    { image: "10.jpg", prompt: "A modern, open-air entrance with a wooden deck, glass doors, and palm trees lining a stone pathway leading to a residential area."},
    { image: "11.jpg", prompt: "A modern, spacious, and well-lit interior with a combination of a living area, kitchen, and dining space, featuring wooden floors, white cabinetry, and large windows that allow natural light to flood the room."},
    { image: "12.jpg", prompt: "A modern, spacious living room with a large clock on the wall, featuring a sleek kitchen area, comfortable seating, and large windows allowing natural light to fill the space."},
    { image: "13.jpg", prompt: "A modern interior hallway with a curved wall featuring a heart-shaped design, tiled flooring, and a staircase leading to an upper level."},
    { image: "14.jpg", prompt: "A modern, spacious interior with a clean, minimalist design, featuring a combination of white walls, polished floors, and dark accents."},
    { image: "15.jpg", prompt: "A modern, well-lit hallway with wooden ceilings, tiled floors, and contemporary artwork displayed on the walls."},
    { image: "16.jpg", prompt: "A modern, spacious living area with a panoramic view, featuring a combination of neutral and vibrant colors, comfortable seating, and decorative elements such as plants and artwork."},
    { image: "17.jpg", prompt: "A modern, stylish bathroom with a unique wallpaper design featuring newspaper print, a white toilet, a sink with a sleek faucet, and a vase with tall, slender plants."},
    // { image: "18.jpg", prompt: "A modern bedroom with a large bed, dark wooden blinds, a blue accent wall, and a mirrored closet."},
    { image: "19.jpg", prompt: "A modern, spacious interior with a kitchen area on the right, featuring dark wooden cabinets, a sink, and a countertop with a few cushions."},
    { image: "20.jpg", prompt: "A modern, spacious living room with large windows offering a view of a garden and greenery outside."},
    { image: "21.jpg", prompt: "A modern kitchen with sleek, dark wooden shelves and cabinets, a white countertop, and a variety of kitchen items neatly arranged on the shelves."},
    // { image: "22.jpg", prompt: "A modern, stylish living room with dark gray walls, white furniture, and various decorative elements, including framed artwork and a large window with blinds."},
    { image: "23.jpg", prompt: "A spacious, well-lit room with a large bed, red chairs, and a built-in entertainment center featuring a TV and various decorative items."},
    { image: "24.jpg", prompt: "Contemporary library interior with bookshelves, arched ceiling, and reading tables."},
];


var txt2pano_out_items = [
    { image: "00.jpg", prompt: "Snowy mountains and frozen lake under the northern lights, with a wooden cabin in the foreground and glowing green aurora in the night sky.", alt: "Snowy mountains and frozen lake under the northern lights, with a wooden cabin in the foreground and glowing green aurora in the night sky." },
    { image: "01.jpg", prompt: "A medieval castle stands proudly on a hilltop surrounded by autumn forests, with golden light spilling across the landscape."},
    { image: "02.jpg", prompt: "Grand European cathedral above a modern city, with tree-lined avenues, wide streets, and clear blue skies.", alt: "Grand European cathedral above a modern city, with tree-lined avenues, wide streets, and clear blue skies." },
    { image: "03.jpg", prompt: "A futuristic city skyline reflects on the calm river at sunset, neon lights glowing against the twilight sky."},
    { image: "04.jpg", prompt: "A grand Gothic cathedral towers over a bustling European plaza filled with people and market stalls." },
    { image: "05.jpg", prompt: "Santorini with whitewashed houses and blue-domed churches overlooking the sparkling Aegean Sea at sunset.", alt: "Santorini with whitewashed houses and blue-domed churches overlooking the sparkling Aegean Sea at sunset." },
    { image: "06.jpg", prompt: "A rainforest city with wooden walkways and treetop houses glimmers in misty sunlight."},
    { image: "07.jpg", prompt: "A futuristic floating city hovers above the sea, its architecture glowing with holographic lights." },
    { image: "08.jpg", prompt: "A medieval castle stands proudly on a hilltop surrounded by autumn forests, with golden light spilling across the landscape." },
    { image: "09.jpg", prompt: "A seaside town with colorful houses sits on steep cliffs overlooking turquoise waves." },
    { image: "10.jpg", prompt: "Snow-covered alpine mountains, with evergreen forests and a frozen lake nestled among the peaks.", alt: "Snow-covered alpine mountains, with evergreen forests and a frozen lake nestled among the peaks." },
    { image: "11.jpg", prompt: "Modern airport terminal with wide glass windows, polished floors, and airplanes parked on the runway outside.", alt: "Modern airport terminal with wide glass windows, polished floors, and airplanes parked on the runway outside." },
    { image: "12.jpg", prompt: "A modern glass skyscraper district rises above green parks and wide boulevards." },
    { image: "13.jpg", prompt: "Modern skyscrapers along a waterfront, with tall buildings facing a clear blue lake.", alt: "Modern skyscrapers along a waterfront, with tall buildings facing a clear blue lake." },
    { image: "14.jpg", prompt: "A desert city with sandstone buildings glows warmly under the golden rays of the setting sun."},
    { image: "15.jpg", prompt: "Aerial cityscape at sunset, with skyscrapers, a river, and glowing evening light.", alt: "Aerial cityscape at sunset, with skyscrapers, a river, and glowing evening light." },
    { image: "16.jpg", prompt: "Desert landscape with golden sand dunes and camels walking under a bright sun.", alt: "Desert landscape with golden sand dunes and camels walking under a bright sun." },
    { image: "17.jpg", prompt: "Futuristic skyline of Dubai Marina, with skyscrapers, waterways, and the Burj Khalifa.", alt: "Futuristic skyline of Dubai Marina, with skyscrapers, waterways, and the Burj Khalifa." },
    { image: "18.jpg", prompt: "A futuristic city skyline reflects on the calm river at sunset, neon lights glowing against the twilight sky." },
    { image: "19.jpg", prompt: "Grand train station hall with high arched ceilings, large windows, and passengers waiting.", alt: "Grand train station hall with high arched ceilings, large windows, and passengers waiting." },
    { image: "20.jpg", prompt: "Rio de Janeiro coastline with Sugarloaf Mountain, sandy beaches, and green hills.", alt: "Rio de Janeiro coastline with Sugarloaf Mountain, sandy beaches, and green hills." },
    { image: "21.jpg", prompt: "A luxurious palace with golden domes reflects in a vast lake at dawn."},
    { image: "22.jpg", prompt: "Lush terraced rice fields surrounded by tropical greenery and blue sky.", alt: "Lush terraced rice fields surrounded by tropical greenery and blue sky." },
    { image: "23.jpg", prompt: "Powerful waterfalls cascading into a river, with mist rising under a bright sky.", alt: "Powerful waterfalls cascading into a river, with mist rising under a bright sky." },
    { image: "24.jpg", prompt: "A canyon with carved temples and ancient ruins stretches into the horizon."},
    { image: "25.jpg", prompt: "Snow-capped mountains surround a small alpine village with wooden chalets and smoking chimneys."},
];

// var inpainting_items = [

// ];

// var outpainting_items = [

// ];

function escapeHtml(str) {
    return (str||'').toString()
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
}

function txt2pano_in_carousel_item_template(item, item_idx, info) {
    return `<div class="x-card" style="min-width: 100px">
                <div style="width: 100%; aspect-ratio: 2/1">
                    <img src="assets/txt2pano_in/${item.image}"
                         alt="${escapeHtml(item.prompt)}"
                         style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; cursor: zoom-in;"
                         onclick="showImageModalFromCarousel('results-txt2pano_in', ${item_idx})">
                </div>
                <div class="caption">
                    <div class="x-handwriting">${escapeHtml(item.prompt)}</div>
                </div>
            </div>`;
}

function txt2pano_out_carousel_item_template(item, item_idx, info) {
    return `<div class="x-card" style="min-width: 100px">
                <div style="width: 100%; aspect-ratio: 2/1">
                    <img src="assets/txt2pano_out/${item.image}"
                         alt="${escapeHtml(item.prompt)}"
                         style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; cursor: zoom-in;"
                         onclick="showImageModalFromCarousel('results-txt2pano_out', ${item_idx})">
                </div>
                <div class="caption">
                    <div class="x-handwriting">${escapeHtml(item.prompt)}</div>
                </div>
            </div>`;
}

// function txt2pano_in_carousel_item_template(item) {
//     return `<div class="x-card" style="min-width: 100px">
//                 <div style="width: 100%; aspect-ratio: 2/1">
//                     <img src="assets/txt2pano_in/${item.image}" 
//                          alt="${item.prompt}" 
//                          style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; cursor: zoom-in;"
//                          onclick="showImageModal(this.src, this.alt)">
//                 </div>
//                 <div class="caption">
//                     <div class="x-handwriting">${item.prompt}</div>
//                 </div>
//             </div>`;
// }

// function txt2pano_out_carousel_item_template(item) {
//     return `<div class="x-card" style="min-width: 100px">
//                 <div style="width: 100%; aspect-ratio: 2/1">
//                     <img src="assets/txt2pano_out/${item.image}" 
//                          alt="${item.prompt}" 
//                          style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; cursor: zoom-in;"
//                          onclick="showImageModal(this.src, this.alt)">
//                 </div>
//                 <div class="caption">
//                     <div class="x-handwriting">${item.prompt}</div>
//                 </div>
//             </div>`;
// }


// function inpainting_carousel_item_template(item) {
//     return `<div class="x-card" style="min-width: 100px">
//                 <div style="width: 100%; aspect-ratio: 2/1">
//                     <img src="assets/inpainting/${item.image}" 
//                          style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
//                 </div>
//             </div>`;
// }

// function outpainting_carousel_item_template(item) {
//     return `<div class="x-card" style="min-width: 100px">
//                 <div style="width: 100%; aspect-ratio: 2/1">
//                     <img src="assets/outpainting/${item.image}" 
//                          style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
//                 </div>
//             </div>`;
// }



// function txt2_carousel_item_template(item) {
//     return `<div class="x-card clickable" style="min-width: 120px" onclick=\'openWindow(txt2_window_template(${JSON.stringify(item)}))\'>
//                 <div class="x-labels">
//                     <div class="x-label">GLB ✓</div>
//                 </div>
//                 <div style="width: 100%; aspect-ratio: 1">
//                     <video autoplay playsinline loop muted height="100%" src="assets/txt2/videos/${item.video}"></video>
//                 </div>
//                 <div class="caption">
//                     <div class="x-handwriting">
//                         ${item.prompt}
//                     </div>
//                 </div>
//             </div>`;
// }

// function img2_carousel_item_template(item) {
//     return `<div class="x-card clickable" style="min-width: 120px" onclick=\'openWindow(img2_window_template(${JSON.stringify(item)}))\'>
//                 <div class="x-labels">
//                     <div class="x-label">GLB ✓</div>
//                 </div>
//                 <div style="width: 100%; aspect-ratio: 1">
//                     <video autoplay playsinline loop muted height="100%" src="assets/img2/videos/${item.video}"></video>
//                 </div>
//                 <div class="caption">
//                     <div class="x-image-prompt">
//                         <img src="assets/img2/images/${item.prompt}" alt="${item.alt}">
//                     </div>
//                 </div>
//             </div>`;
// }


// function txt2_window_template(item) {
//     let prompt = `<div class="x-handwriting">${item.prompt}</div>`;
//     let panel = asset_panel_template(prompt);
//     item = JSON.parse(JSON.stringify(item));
//     item.model = 'assets/txt2/glbs/' + item.model
//     return modelviewer_window_template(item, panel);
// }


// function img2_window_template(item) {
//     let prompt = `<div class="x-image-prompt"><img src="assets/img2/images/${item.prompt}" alt="${item.alt}"></div>`;
//     let panel = asset_panel_template(prompt);
//     item = JSON.parse(JSON.stringify(item));
//     item.model = 'assets/img2/glbs/' + item.model
//     return modelviewer_window_template(item, panel);
// }
