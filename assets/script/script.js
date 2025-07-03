$(document).ready(function () {
    // Open modal
    $("#addProductBtn").click(function () {
        $("#addProductModal").removeClass("hidden");
    });

    // Close modal
    $("#closeModalBtn").click(function () {
        $("#addProductModal").addClass("hidden");
    });

    // Save product
    $("#btn-save").click(function () {
        let pro_name = $("#name").val().trim();
        let pro_price = parseFloat($("#price").val());
        let pro_qty = parseInt($("#qty").val());
        let img = $("#img").val().trim();
        let pro_dec = $("#dec").val().trim();

        // Basic validation
        if (!pro_name || isNaN(pro_price) || isNaN(pro_qty) || !img) {
            $("#errorToast").removeClass("hidden").text("Please fill all fields correctly.");
            setTimeout(() => {
                $("#errorToast").addClass("hidden");
            }, 2000);
            return;
        }

        const newProduct = {
            image: img,
            name: pro_name,
            price: pro_price,
            qty: pro_qty,
            dec: pro_dec
        };

        $.ajax({
            url: "http://localhost:3000/products",
            type: "POST",
            data: JSON.stringify(newProduct),
            contentType: "application/json; charset=UTF-8",
            dataType: "json",
            success: function (data) {
                $("#successToast").removeClass("hidden").text("Product added successfully!");
                setTimeout(() => {
                    $("#successToast").addClass("hidden");
                }, 2000);
                $("#addProductModal").addClass("hidden");
                $("#name, #price, #qty, #img, #dec").val(""); // Clear form
                loadProducts();
            },
            error: function () {
                $("#errorToast").removeClass("hidden").text("Failed to add product.");
                setTimeout(() => {
                    $("#errorToast").addClass("hidden");
                }, 2000);
            }
        });
    });

    // Display products from JSON
    function loadProducts() {
        $.ajax({
            url: "http://localhost:3000/products",
            type: "GET",
            dataType: "json",
            success: function (products) {
                let rows = "";
                products.forEach(function (product, index) {
                    rows += `
                        <tr class="border-b hover:bg-gray-50">
                            <td class="px-4 py-2">${index + 1}</td>
                            <td class="px-4 py-2">${product.id}</td>
                            <td class="px-4 py-2">
                                <img src="${product.image}" alt="${product.name}" class="w-12 h-12 object-cover rounded" />
                            </td>
                            <td class="px-4 py-2">${product.name.length > 15 ? product.name.substring(0, 15) + "..." : product.name}</td>
                            <td class="px-4 py-2">${product.price}</td>
                            <td class="px-4 py-2">${product.qty}</td>
                            <td class="px-4 py-2">${product.dec.length > 20 ? product.dec.substring(0, 20) + "..." : product.dec}</td>
                            <td class="px-4 py-2 flex gap-2">
                                <button class="edit-btn bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition" data-id="${product.id}">
                                    Edit
                                </button>
                                <button class="delete-btn bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition" data-id="${product.id}">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    `;
                });
                $(".table-tbody").html(rows);
            },
            error: function () {
                $(".table-tbody").html("<tr><td colspan='8'>Failed to load products.</td></tr>");
            }
        });
    }

    // Initial load
    loadProducts();
});
