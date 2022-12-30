<template>
  <div class="home-container">
    <div class="absolute-bottom row justify-end">
      <q-img
        class="bg-img"
        src="@/assets/bg-home.png"
      />
    </div>
    <div class="row justify-start">
      <q-card class="card-container q-py-sm">
        <q-item>
          <q-item-section avatar>
            <q-avatar square>
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label><strong>Welcome </strong> </q-item-label>
            <q-item-label caption>
              Gerardo Landeros
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item>
          <q-item-section>
            <q-btn
              color="primary"
              icon="mdi-bell"
              label="Notification"
              flat
            >
              <q-badge
                color="green"
                floating
                transparent
              >
                10+
              </q-badge>
            </q-btn>
          </q-item-section>
        </q-item>
      </q-card>
    </div>
    <div class="row justify-start q-my-md">
      <q-card class="col-4 card-container q-py-sm">
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6">
              <strong>Deliveries</strong>
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-btn
              color="light-blue-8"
              label="View"
              class="q-px-sm"
            />
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item>
          <q-item-section>
            <q-item-label class="text-center">
              <strong>2747</strong>
            </q-item-label>
            <q-item-label
              class="text-center"
              caption
            >
              Delivered
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-center">
              <strong>20</strong>
            </q-item-label>
            <q-item-label
              class="text-center"
              caption
            >
              On route
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-center">
              <strong>12</strong>
            </q-item-label>
            <q-item-label
              class="text-center"
              caption
            >
              In process
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item>
          <q-item-section>
            <q-item-label class="text-center">
              <strong>Client</strong>
            </q-item-label>
            <q-item-label
              class="text-center"
              caption
            >
              Dental Galia
            </q-item-label>
            <q-item-label
              class="text-center"
              caption
            >
              Consultorio Dental
            </q-item-label>
            <q-item-label
              class="text-center"
              caption
            >
              Biodentaq Avanzada
            </q-item-label>
            <q-item-label
              class="text-center"
              caption
            >
              Consultorio Dental
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-center">
              <strong>Received</strong>
            </q-item-label>
            <q-item-label
              class="text-center"
              caption
            >
              Laura Gonzalez
            </q-item-label>
            <q-item-label
              class="text-center"
              caption
            >
              Guadalupe Landeros
            </q-item-label>
            <q-item-label
              class="text-center"
              caption
            >
              Maria Lopez
            </q-item-label>
            <q-item-label
              class="text-center"
              caption
            >
              Alejandra Aguilar
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-center">
              <strong>Delivery day</strong>
            </q-item-label>
            <q-item-label
              class="text-center"
              caption
            >
              23/12/2022
            </q-item-label>
            <q-item-label
              class="text-center"
              caption
            >
              22/12/2022
            </q-item-label>
            <q-item-label
              class="text-center"
              caption
            >
              22/12/2022
            </q-item-label>
            <q-item-label
              class="text-center"
              caption
            >
              22/12/2022
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.home-container{
  font-size: 14px;
  max-height: 100%;
}

.bg-img{
  max-width: 900px;
  max-height: 900px;
  position: relative;
}

.card-container{
  border-radius: 15px;
  background-color: rgba(255,255,255,0.7);
}

</style>
