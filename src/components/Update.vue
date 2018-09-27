<template>
  <v-card-text style="height: 300px;">
    <ul>
      <li>
        2018.09.27 - v1.7e, Minor Bug Fixes
        <ul>
          <li>Enter to submit only succeeds for topmost dialog</li>
          <li>Rounding errors scaled to account for JS math weirdness</li>
          <li>To Order column shows reorder amount if reorder point is triggered, may refine function in future</li>
        </ul>
      </li>
      <li>
        2018.09.26 - v1.7d, Intuitiveness
        <ul>
          <li>Clicking on Item Name now brings up the Edit Item dialog, previously done on the info icon</li>
          <li>Info icon brings up the a separate tab for Item Info, read only</li>
        </ul>
      </li>
      <br>
      <li>
        2018.09.25 - v1.7c, Minor improvements
        <ul>
          <li>Update notes added to Header</li>
          <li>Calculation of Reorder Points now done whenever Item is updated and if it is active</li>
          <li>Enabled form submit on Enter for Item, Assay, Vendor, and Order Completion</li>
          <li>Ordering initialization fixed and ready to use</li>
        </ul>
      </li>
      <br>
      <li>
        2018.09.24 - v1.7b, Initial beta version
        <ul>
          <li>Able to enter/edit Item, Assay, and Vendor information</li>
          <li>Able to view Item information in a separate tab</li>
          <li>User and Admin modes</li>
        </ul>
      </li>
    </ul>
  </v-card-text>
</template>

<script>
export default {

}
</script>

<style scoped>

</style>
