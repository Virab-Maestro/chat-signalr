<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInput,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonToast,
  IonLabel,
  IonNote,
} from "@ionic/vue";
import { sendOutline } from "ionicons/icons";
import signalRService from "@/utils/signalRService.ts";

const username = ref("John"),
    message = ref(''),
    messages = ref([]),
    isToastOpen = ref(false)

const sendMessage = function(user, msg) {
  if(msg.length == 0) {
    isToastOpen.value = true;
    return
  }
  signalRService.sendMessage(user, msg)
  message.value = ""
}

onMounted(() => {
  signalRService.startConnection("http://localhost:3209/messenger/hub")

  signalRService.onReceiveMessage((user, msg) => {
    messages.value = [...messages.value, { user, msg }]
  })
})

onUnmounted(() => {
  signalRService.connection.stop()
})
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center">Chat</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="chat-wrapper ion-padding">
        <ion-row>
          <ion-col>
            <ion-list>
              <ion-item v-for="msg in messages" style="display: flex; gap: 10px">
                <ion-label>
                  <h3>{{msg.user}}</h3>
                  <p>{{msg.msg}}</p>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-col>
        </ion-row>

        <ion-row class="ion-align-items-baseline">
          <ion-col offset="4" size="4">
            <ion-input
                v-model="message"
                :maxlength="50"
                :counter="true"
                label="Message:"
                fill="solid"
            />
          </ion-col>

          <ion-col class="ion-padding-start">
            <ion-button size="large" shape="round" @click="sendMessage(username, message)">
              <ion-icon slot="icon-only" :icon="sendOutline"></ion-icon>
            </ion-button>
          </ion-col>
        </ion-row>
      </div>

      <ion-toast
          :is-open="isToastOpen"
          message="Введите сообщение"
          :duration="2000"
          position="top"
          @didDismiss="isToastOpen = false"
      />
    </ion-content>
  </ion-page>
</template>

<style scoped>
.chat-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
</style>