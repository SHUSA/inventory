<template>
  <v-card-text style="height: 300px;">
    <ul>
      <li>
        2018.10.08 - v1.7i, CSV Export
        <ul>
          <li>Full active inventory can be exported as CSV</li>
        </ul>
      </li>
      <li>
        2018.10.05 - v1.7h, Tiny Improvements
        <ul>
          <li>Added Go to Bottom button to easier access table scrollbar</li>
          <li>Fixed a bug with notifications displaying at the wrong time and closes them when a new form is opened</li>
        </ul>
      </li>
      <br>
      <li>
        2018.10.04 - v1.7g, Helpful Things
        <ul>
          <li>Go to Top button added when you scroll too far down</li>
          <li>Notifications added when things are saved, updated, or ordered</li>
          <li>Fixed the issue where pressing Enter to submit forms closes all open dialog boxes</li>
          <!-- <li>Error messages streamlined</li> -->
        </ul>
      </li>
      <br>
      <li>
        2018.10.01 - v1.7f, Order Bug Fixes
        <ul>
          <li>Fixed a bug with ordering where a new order form is constantly created</li>
          <li>Added a badge for manually ordered items in Order if it is under the reorder point</li>
          <li>Change "Order" button to "Manual Order" for clarity</li>
        </ul>
      </li>
      <br>
      <li>
        2018.09.27 - v1.7e, Minor Bug Fixes
        <ul>
          <!-- <li>Enter to submit only succeeds for topmost dialog</li> -->
          <li>Rounding errors scaled to account for JS math weirdness</li>
          <li>To Order column shows reorder amount if reorder point is triggered, may refine function in future</li>
        </ul>
      </li>
      <br>
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
