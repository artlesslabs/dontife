<template>
  <div class="home-container">
    <div class="absolute-bottom row justify-end">
      <q-img
        class="bg-img"
        src="@/assets/bg-home.png"
      />
    </div>
    <div class="row justify-start">
      <q-card class="col-12 col-md-4 card-container q-py-sm">
        <q-item>
          <q-item-section avatar>
            <q-avatar square>
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-title-container">
              <strong>Welcome </strong>
            </q-item-label>
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
      <q-card class="col-12 col-md-4 card-container q-py-sm">
        <div class="q-px-lg">
          <q-item>
            <q-item-section>
              <q-item-label class="text-h6 title-card-container-deliveries q-px-sm">
                <strong>Deliveries</strong>
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-btn
                size="lg"
                color="light-blue-8 button-container"
                label="View"
                class="q-px-sm"
              />
            </q-item-section>
          </q-item>
        </div>
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
    <div class="row q-my-md">
      <q-card class="col-12 col-md-4 card-container q-py-lg q-px-md">
        <div class="q-px-lg">
          <q-item>
            <q-item-section>
              <q-item-label class="text-h6 title-card-container-info q-px-sm">
                <strong>Refund requestsd</strong>
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <q-item>
          <q-item-section avatar>
            <q-btn
              round
              class="button-ref"
            >
              <q-icon
                name="fa-solid fa-bag-shopping"
                color="primary"
              />
            </q-btn>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6">
              You have <strong>17 open refund requests</strong> to action. This includes 5 new requests.
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="items-center">
          <q-item-section>
            <q-btn
              label="Review refund requests"
              color="primary"
              class="q-px-sm"
            />
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

.card-container-info{
  border-radius: 15px;
  background-color: rgba(162, 160, 160, 0.4);
  height: 100px;
  padding-top: 5px;
}

.button-container{
  border-radius: 15px!important;
}

.button-ref{
  background-color: rgba(0, 193, 68, 0.54);
}

.text-title-container{
  font-size: 25px;
}

</style>

<style>

.title-card-container-deliveries:before {
  content: "";
  background-color: #3251b9;
  top: 30%;
  left: 0;
  width: 16px;
  height: 24px;
  position: absolute;
  -webkit-tranform: translateY(-50%);
  trasform: translateY(-50%);
  border-radius: 4px;
}

.title-card-container-info:before {
  content: "";
  background-color: #cb8383;
  top: 25%;
  left: 0;
  width: 16px;
  height: 24px;
  position: absolute;
  -webkit-tranform: translateY(-50%);
  trasform: translateY(-50%);
  border-radius: 4px;
}

</style>
