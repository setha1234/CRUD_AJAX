$(document).ready(function () {
    // Open modal
    $("#addProductBtn").click(function () {
        $("#addProductModal").removeClass("hidden");
        $("h2").html("Add Products");
        $("#btn-update").hide();
        $("#btn-save").show();
    });




    // Close modal
    $("#closeModalBtn").click(function () {
        $("#addProductModal").addClass("hidden");
    });

    // Save product
    $("#btn-save").click(function (e) {
        e.preventDefault();

        let pro_name = $("#name").val().trim();
        let pro_price = parseFloat($("#price").val());
        let pro_qty = parseInt($("#qty").val());
        let img = $("#img").val().trim();
        let pro_dec = $("#dec").val().trim();

        // Basic validation
        if (!pro_name || isNaN(pro_price) || pro_price <= 0 || isNaN(pro_qty) || pro_qty < 0 || !img) {
            showError("Please fill all fields correctly.");
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
            success: function () {
                showSuccess("Product added successfully!");
                $("#addProductModal").addClass("hidden");
                $("#addProductForm")[0].reset();
                loadProducts();
            },
            error: function () {
                showError("Failed to add product.");
            }
        });
    });

    // Load products
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
                            <td class="px-4 py-2">${truncate(product.name, 15)}</td>
                            <td class="px-4 py-2">${product.price}</td>
                            <td class="px-4 py-2">${product.qty}</td>
                            <td class="px-4 py-2">${truncate(product.dec, 20)}</td>
                            <td class="px-4 py-2 flex gap-2">
                                <button class="edit-btn bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded" data-id="${product.id}">Edit</button>
                                <button class="delete-btn bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded" data-id="${product.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                });
                $(".table-tbody").html(rows);
            },
            error: function () {
                $(".table-tbody").html("<tr><td colspan='8' class='text-center text-red-500 py-4'>Failed to load products.</td></tr>");
            }
        });
    }
    $(document).on('click', '.delete-btn', function () {
        const id = $(this).data("id");
        if (confirm(`Are you what to delete this product ${id}`)) {
            $.ajax({
                url: `http://localhost:3000/products/${id}`,
                type: "DELETE",
                success: function () {
                    alert(`Delete Successfully!! ${id}`)
                },
                error: function () {
                    alert("Delete not complete!")
                }
            })
        }
    })

    $(document).on("click", ".edit-btn", function () {
        $("#addProductModal").removeClass("hidden");
        $("h2").html("Update Products");
        $("#btn-save").hide();
        $("#btn-update").show();
    })

    // btn update

    // Store the current editing product ID
    let editingProductId = null;

    // When Edit button is clicked, fill form and set editingProductId
    $(document).on("click", ".edit-btn", function () {
        const id = $(this).data("id");
        editingProductId = id;
        $("h2").html("Update Products");
        $("#btn-save").hide();
        $("#btn-update").show();

        // Fetch product data and fill the form
        $.ajax({
            url: `http://localhost:3000/products/${id}`,
            type: "GET",
            dataType: "json",
            success: function (product) {
                $("#name").val(product.name);
                $("#price").val(product.price);
                $("#qty").val(product.qty);
                $("#img").val(product.image);
                $("#dec").val(product.dec);
            },
            error: function () {
                showError("Failed to load product data.");
            }
        });

        $("#addProductModal").removeClass("hidden");
    });

    // Update product
    $(document).on("click", "#btn-update", function (e) {
        e.preventDefault();

        if (!editingProductId) {
            showError("No product selected for update.");
            return;
        }

        let pro_name = $("#name").val().trim();
        let pro_price = parseFloat($("#price").val());
        let pro_qty = parseInt($("#qty").val());
        let img = $("#img").val().trim();
        let pro_dec = $("#dec").val().trim();

        // Basic validation
        if (!pro_name || isNaN(pro_price) || pro_price <= 0 || isNaN(pro_qty) || pro_qty < 0 || !img) {
            showError("Please fill all fields correctly.");
            return;
        }

        const update_Product = {
            image: img,
            name: pro_name,
            price: pro_price,
            qty: pro_qty,
            dec: pro_dec
        };

        $.ajax({
            url: `http://localhost:3000/products/${editingProductId}`,
            type: "PUT",
            data: JSON.stringify(update_Product),
            contentType: "application/json; charset=UTF-8",
            dataType: "json",
            success: function () {
                showSuccess("Product updated successfully!");
                $("#addProductModal").addClass("hidden");
                $("#addProductForm")[0].reset();
                loadProducts();
                editingProductId = null;
            },
            error: function () {
                showError("Failed to update product.");
            }
        });
    });
    // // Utility functions
    function showSuccess(message) {
        $("#successToast").removeClass("hidden").text(message);
        setTimeout(() => {
            $("#successToast").addClass("hidden");
        }, 2000);
    }

    function showError(message) {
        $("#errorToast").removeClass("hidden").text(message);
        setTimeout(() => {
            $("#errorToast").addClass("hidden");
        }, 2000);
    }

    function truncate(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    }

    // Initial load
    loadProducts();
});


