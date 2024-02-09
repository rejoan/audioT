<script>
  import { ref } from 'vue';
  import UiParentCard from '@/components/shared/UiParentCard.vue';
  import UiChildCard from '@/components/shared/UiChildCard.vue';
  import OrdinaryForm from "@/components/forms/form-layouts/OrdinaryForm.vue";
  import FileAccept from '@/components/forms/form-elements/fileinput/FileInputAccept.vue';

// common components
  import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
// theme breadcrumb
  const page = ref({title: 'Form Layout'});
  const breadcrumbs = ref([
    {
      text: 'Home',
      disabled: false,
      href: '/'
    },
    {
      text: 'Form layout',
      disabled: true,
      href: '#'
    }
  ]);
  
  export default defineComponent({

  data() {
    return {
      resText: '',
      soapNote: '',
      loading: false
    }
  },
   methods: {
      handleFileUpload(event) {
        this.file = event.target.files[0];
      },
      async handleSubmit() {
        let self = this;
        self.loading = true;
        const formData = new FormData();
        formData.append('file', this.file);
        formData.append('model', 'whisper-1');
        formData.append('response_format', 'text');

        const headers = {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer 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'
        }
        await axios
          .post("https://api.openai.com/v1/audio/transcriptions", formData, {
            headers: headers
          }).then(function(response){
            self.loading = false;
          self.resText = response.data;
        })
        .catch(function(fail){
          console.log(fail);
        });
      },
      
      handleSoap() {
        let self = this;
        self.loading = true;
        var jsonObj = {
          model: 'gpt-3.5-turbo',
          messages: [{"role":"user", "content":'write a soap note based on '+self.resText}]
        };

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        }
        axios
          .post("https://api.openai.com/v1/chat/completions", JSON.stringify(jsonObj), {
            headers: headers
          }).then(function(response){
            self.loading = false;
          self.soapNote = response.data.choices[0].message.content;
        })
        .catch(function(fail){
          console.log(fail);
        });
      },
    }
    })

</script>
<template>
    <v-row>
        <v-col v-if="loading" cols="12" lg="12">
          <p>Please wait...</p>
      </v-col>
  </v-row>
  
  <v-row>
    <form @submit.prevent="handleSubmit">
      <v-col cols="12" lg="12">
        <v-label class="mb-2 font-weight-medium" for="oemail">Audio File</v-label>
        <v-col cols="12" sm="6">
          <input type="file" @change="handleFileUpload( $event )" required/>
        </v-col>

        <v-btn color="primary" rounded="pill" type="submit" :class="loading ? 'v-btn--disabled' : '' ">Submit</v-btn>
      </v-col>
    </form>
    <v-col cols="12" lg="12">
        {{ resText }}
    </v-col>
    
  </v-row>
  <v-row>
    <v-col cols="12" lg="12">
        <v-btn color="primary" rounded="pill" @click="handleSoap" :class="loading ? 'v-btn--disabled' : '' ">SOAP Note</v-btn>
    </v-col>
    
    <v-col cols="12" lg="12">
        {{ soapNote }}
    </v-col>
  </v-row>
  
</template>
