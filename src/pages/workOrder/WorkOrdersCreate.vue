<template>
  <DefaultButton
    v-if="selectedCategory"
    button-style="icon"
    round
    margin="q-mx-xs"
    color="primary"
    height="auto"
    icon="fa-solid fa-arrow-left"
    @click="goBack()"
  />
  <CategoryForm
    v-if="!selectedCategory"
    @categoryClick="pickCategory"
  />
  <SubcategoryForm
    v-if="selectedCategory && !selectedSubcategory"
    :category="selectedCategory"
    @subcategoryClick="pickSubCategory"
  />
  <OrderConfigurationForm
    v-if="selectedSubcategory"
    :subcategory="selectedSubcategory"
    @orderConfigurationClick="pickOrderConfiguration"
  />
</template>

<script setup>
import CategoryForm from "pages/workOrder/orderFlow/CategoryForm.vue";
import { ref } from "vue";
import SubcategoryForm from "pages/workOrder/orderFlow/SubcategoryForm.vue";
import OrderConfigurationForm from "pages/workOrder/orderFlow/OrderConfigurationForm.vue";
import DefaultButton from "components/general/DefaultButton.vue";

let selectedCategory = ref( );
let selectedSubcategory = ref();
let selectedOrderConfiguration = ref();

function pickCategory( category ){
  selectedCategory.value = category;
}

function pickSubCategory( subcategory ){
  selectedSubcategory.value = subcategory;
}

function pickOrderConfiguration( orderConfiguration ){
  selectedOrderConfiguration.value = orderConfiguration;
}

function goBack(){
  if( selectedSubcategory.value ){
    selectedSubcategory.value='';
  }else{
    selectedCategory.value='';
  }

}
</script>

<style scoped>

</style>
