<template>
  <div class="row">
    <div
      v-if="odontograma"
      class="col-3 q-pa-md odontograma-container"
    >
      <div
        class="odontograma q-pa-lg"
      >
        <q-img
          src="../../../assets/odontograma.svg"
        />
      </div>
    </div>
    <div class="q-pa-md">
      <div
        v-if="category === 'protesis'"
        class="col-6 form-container q-pa-md"
      >
        <p class="text-h6">
          Seleccione el Material a utilizar
        </p>
        <div
          v-if="subcategory === 'coronas' || subcategory === 'carillas' || subcategory === 'coronasSobreImplantes'"
          class="row items-center"
        >
          <q-card
            class="row my-card items-center justify-center"
            :class="`${material === 'zirconia' ? 'material-active' : ''} `"
            @click="material='zirconia'"
          >
            <p class="text-h6">
              Zirconia
            </p>
            <q-img
              class="bg-img"
              src="@/assets/zirconia.png"
            />
          </q-card>
          <q-card
            class="row my-card items-center justify-center"
            :class="`${material === 'zirconiaEstratificada' ? 'material-active' : ''} `"
            @click="material='zirconiaEstratificada'"
          >
            <p class="text-h6">
              Zirconia estratificada
            </p>
          </q-card>
          <q-card
            class="row my-card items-center justify-center"
            :class="`${material === 'disilicatoDeLitio' ? 'material-active' : ''} `"
            @click="material='disilicatoDeLitio'"
          >
            <p class="text-h6">
              Disilicato de litio
            </p>
          </q-card>
          <q-card
            class="row my-card items-center justify-center"
            :class="`${material === 'resinaHibrida' ? 'material-active' : ''} `"
            @click="material='resinaHibrida'"
          >
            <p class="text-h6">
              Resina híbrida
            </p>
          </q-card>
        </div>
        <div
          v-if="subcategory === 'puentes' || subcategory === 'incrustaciones'"
          class="row items-center"
        >
          <q-card
            class="row my-card items-center justify-center"
            :class="`${material === 'zirconia' ? 'material-active' : ''} `"
            @click="material='zirconia'"
          >
            <p class="text-h6">
              Zirconia
            </p>
            <q-img
              class="bg-img"
              src="@/assets/zirconia.png"
            />
          </q-card>
          <q-card
            class="row my-card items-center justify-center"
            :class="`${material === 'zirconiaEstratificada' ? 'material-active' : ''} `"
            @click="material='zirconiaEstratificada'"
          >
            <p class="text-h6">
              Zirconia estratificada
            </p>
          </q-card>
          <q-card
            class="row my-card items-center justify-center"
            :class="`${material === 'disilicatoDeLitio' ? 'material-active' : ''} `"
            @click="material='disilicatoDeLitio'"
          >
            <p class="text-h6">
              Disilicato de litio
            </p>
          </q-card>
        </div>
        <div v-if="material">
          <p class="text-h6">
            Seleccione el Colorímetro utilizado
          </p>
          <div class="row">
            <q-card
              class="my-card row items-center justify-center"
              :class="`${colorimetro === 'vitaClassic' ? 'material-active' : ''} `"
              @click="colorimetro='vitaClassic'"
            >
              <p class="text-h6">
                Vita Classic
              </p>
            </q-card>
            <q-card
              class="my-card row items-center justify-center"
              :class="`${colorimetro === 'vita3dMaster' ? 'material-active' : ''} `"
              @click="colorimetro='vita3dMaster'"
            >
              <p class="text-h6">
                Vita 3D Master
              </p>
            </q-card>
            <q-card
              class="my-card row items-center justify-center"
              :class="`${colorimetro === 'chromascop' ? 'material-active' : ''} `"
              @click="colorimetro='chromascop'"
            >
              <p class="text-h6">
                Chromascop
              </p>
            </q-card>
          </div>
          <div v-if="colorimetro">
            <p
              v-if="colorimetro"
              class="text-h6"
            >
              Seleccione el color
            </p>
            <DefaultSelect
              v-if="colorimetro === 'vitaClassic' && material !== 'resinaHibrida'"
              v-model="order.color"
              label="Color"
              :options="optionsVitaClassic"
            />
            <DefaultSelect
              v-if="colorimetro === 'vita3dMaster' && material !== 'resinaHibrida'"
              v-model="order.color"
              label="Color"
              :options="optionsVita3dMaster"
            />
            <DefaultSelect
              v-if="colorimetro === 'chromascop' && material !== 'resinaHibrida'"
              v-model="order.color"
              label="Color"
              :options="optionsChromascop"
            />
            <DefaultSelect
              v-if="material === 'resinaHibrida'"
              v-model="order.color"
              label="Color"
              :options="optionsResinaHibrida"
            />
          </div>
          <div />
        </div>
        <div v-if="order.color">
          <p class="text-h6">
            Agregue Observaciones e imagenes
          </p>
          <div @click="menuProtesisSeleccionada = !menuProtesisSeleccionada">
            <q-img
              width="100px"
              src="../../../assets/zirconia.png"
            />
          </div>
          <q-menu v-model="menuProtesisSeleccionada" />

          <TextInput
            v-model="order.comments"
            label="Observaciones"
            type="textarea"
          />
          <FileInput
            v-model="order.files.images"
            label="Add Images"
            multiple
          />
        </div>
      </div>
      <div
        v-if="subcategory === 'alineadores' || subcategory === 'silensorSl' || subcategory === 'miorelajantes' || subcategory === 'protectoresDeportivos'"
        class="form-container q-pa-md row"
      >
        <div class="q-pr-md">
          <p class="text-h6">
            Seleccione el método
          </p>
          <DefaultSelect
            v-model="order.method"
            label="Método"
            :options="[ { label: 'Escaneo', value: 'scan' }, { label: 'Modelo de yeso', value: 'yeso' } ]"
          />
          <FileInput
            v-if="order.method === 'scan'"
            v-model="order.files.scan"
            label="Add Scan"
            multiple
          />
          <FileInput
            v-if="subcategory === 'alineadores'"
            v-model="order.files.laboratoryStudies"
            label="Laboratory Studies "
            multiple
          />
          <TextInput
            v-if="order.method === 'yeso'"
            v-model="order.street"
            label="Street"
          />
          <DefaultSelect
            v-if="subcategory === 'miorelajantes'"
            v-model="order.miorelajantes"
            label="Seleccione el grosor"
            :options="[ { label: '2mm', value: '2mm' }, { label: '3mm', value: '3mm' }, { label: '4mm', value: '4mm' } ]"
          />
        </div>
        <div v-if="subcategory === 'miorelajantes'">
          <p class="text-h6">
            Seleccione el color
          </p>
          <div class="row">
            <q-card
              class="row my-card items-center justify-center"
              :class="`${color === 'verde' ? 'material-active' : ''} `"
              @click="color='verde'"
            >
              <p class="text-h6">
                Verde
              </p>
            </q-card>
            <q-card
              class="row my-card items-center justify-center"
              :class="`${color === 'azul' ? 'material-active' : ''} `"
              @click="color='azul'"
            >
              <p class="text-h6">
                Azul
              </p>
            </q-card>
            <q-card
              class="row my-card items-center justify-center"
              :class="`${color === 'transparente' ? 'material-active' : ''} `"
              @click="color='transparente'"
            >
              <p class="text-h6">
                Transparente
              </p>
            </q-card>
            <q-card
              class="row my-card items-center justify-center"
              :class="`${color === 'rosa' ? 'material-active' : ''} `"
              @click="color='rosa'"
            >
              <p class="text-h6">
                Rosa
              </p>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import TextInput from "components/general/inputs/TextInput.vue";
import FileInput from "components/general/inputs/FileInput.vue";
import { ref } from "vue";
import DefaultSelect from "components/general/inputs/DefaultSelect.vue";

const props = defineProps( {
  subcategory: { type: String },
  category: { type: String }
} );
defineEmits( [ 'orderConfigurationClick' ] );

let material = ref( '' );
let colorimetro = ref( '' );
let color= ref( '' );
let order = ref( { files: {} } );
const odontograma = props.category === 'protesis';
let menuProtesisSeleccionada = ref( false );

let optionsVitaClassic = [
  { label: 'A1', value: 'a1' },
  { label: 'A2', value: 'a2' },
  { label: 'A3', value: 'a3' },
  { label: 'A3.5', value: 'a3.5' },
  { label: 'A4', value: 'a4' },
  { label: 'B1', value: 'b1' },
  { label: 'B2', value: 'b2' },
  { label: 'B3', value: 'b3' },
  { label: 'B4 ', value: 'b4' },
  { label: 'C1 ', value: 'c1' },
  { label: 'C2 ', value: 'c2' },
  { label: 'C3 ', value: 'c3' },
  { label: 'C4 ', value: 'c4' },
  { label: 'D2 ', value: 'd2' },
  { label: 'D3 ', value: 'd3' },
  { label: 'D4 ', value: 'd4' },
];

let optionsVita3dMaster = [
{ label: '0M1', value: '0M1' },
{ label: '0M2', value: '0M2' },
{ label: '0M3', value: '0M3' },
{ label: '1M1', value: '1M1' },
{ label: '1M2', value: '1M2' },
{ label: '2L1.5', value: '2L1.5' },
{ label: '2L2.5', value: '2L2.5' },
{ label: '2M1', value: '2M1' },
{ label: '2M2', value: '2M2' },
{ label: '2M3', value: '2M3' },
{ label: '2R1.5', value: '2R1.5' },
{ label: '2R2.5', value: '2R2.5' },
{ label: '3L1.5', value: '3L1.5' },
{ label: '3L2.5', value: '3L2.5' },
{ label: '3M1', value: '3M1' },
{ label: '3M2', value: '3M2' },
{ label: '3M3', value: '3M3' },
{ label: '3R1.5', value: '3R1.5' },
{ label: '3R2.5', value: '3R2.5' },
{ label: '4L1.5', value: '4L1.5' },
{ label: '4L2.5', value: '4L2.5' },
{ label: '4M1', value: '4M1' },
{ label: '4M2', value: '4M2' },
{ label: '4M3', value: '4M3' },
{ label: '4R1.5', value: '4R1.5' },
{ label: '4R2.5', value: '4R2.5' },
{ label: '5M1', value: '5M1' },
{ label: '5M2', value: '5M2' },
{ label: '5M3', value: '5M3' },
];

let optionsChromascop = [
  { label: '01', value: '01' },
  { label: '1A', value: '1a' },
  { label: '2A', value: '2a' },
  { label: '1C', value: '1c' },
  { label: '2B', value: '2b' },
  { label: '1D', value: '1d' },
  { label: '1E', value: '1e' },
  { label: '2C', value: '2c' },
  { label: '3A ', value: '3a' },
  { label: '5B ', value: '5b' },
  { label: '2E ', value: '2e' },
  { label: '3E ', value: '3e' },
  { label: '4A ', value: '4a' },
  { label: '6B ', value: '6b' },
  { label: '4B ', value: '4b' },
  { label: '6C ', value: '6c' },
  { label: '6D ', value: '6d' },
  { label: '4C ', value: '4c' },
  { label: '3C ', value: '3c' },
  { label: '4D ', value: '4d' },
];

let optionsResinaHibrida = [
  { label: 'A1', value: 'a1' },
  { label: 'A2', value: 'a2' },
  { label: 'A3', value: 'a3' },
  { label: 'B1', value: 'b1' },
  { label: 'B2', value: 'b2' },
];

</script>

<style lang="scss" scoped>
.my-card {
  width: 250px;
  height: 150px;
  cursor: pointer;
  text-align: center;
  border-radius: 15px;
  margin: 10px;
}

.material-active{
  background-color: #FECF61;
  color: #18571b;
  font-weight: 900!important;
}

.bg-img{
  max-width: 100px;
  max-height: 100px;
}

.odontograma{
  background-color: #FFFFFF66;
  border-radius: 25px;
  overflow: hidden;
}

.form-container{
  background-color: #FFFFFF66;
  border-radius: 25px;
  overflow: hidden;
}
</style>
