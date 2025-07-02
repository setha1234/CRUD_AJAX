$(document).ready(function(){
    $("#addProductBtn").click(function(){
        $("#addProductModal").removeClass("hidden");
    })
    $("#closeModalBtn").click(function(){
        $("#addProductModal").addClass("hidden");
    })
})