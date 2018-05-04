<template>
  <v-app id="app">
    <v-container fluid>

      <v-layout align-center justify-center>
        <v-flex xs12 sm10 md6>
          <v-card class="elevation-3">
            <v-toolbar height="64px" dark color="primary">
              <v-toolbar-title>Vue.js PWA tutorial</v-toolbar-title>

              <v-spacer></v-spacer>

              <v-toolbar-items class="align-center">
                <v-icon class="pr-2">schedule</v-icon>
                <v-switch v-model="addDue" hide-details></v-switch>
              </v-toolbar-items>

              <v-toolbar-items class="align-center">
                <v-icon class="pr-2 pl-3">info_outline</v-icon>
                <v-switch v-model="addDetail" hide-details></v-switch>
              </v-toolbar-items>
            </v-toolbar>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout align-center justify-center>
        <v-flex xs12 sm10 md6>
          <v-card class="elevation-3">
            <transition name="slide-fade">
              <v-flex d-flex justify-center v-if="addDue" class="pb-3">
                <v-spacer></v-spacer>
                <v-flex class="px-2">
                  <v-dialog ref="pickerDate"
                            lazy
                            :close-on-content-click="false"
                            v-model="pickerDate"
                            transition="scale-transition"
                            width="290px"
                            :nudge-bottom="60"
                            :return-value.sync="pickedDate"
                  >
                    <v-text-field
                            slot="activator"
                            label="Date"
                            v-model="pickedDate"
                            prepend-icon="event"
                            hide-details
                            readonly
                    ></v-text-field>
                    <v-date-picker v-model="pickedDate" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat small color="primary" @click="pickerDate = false">Cancel</v-btn>
                      <v-btn flat small color="primary" @click="$refs.pickerDate.save(pickedDate)">OK</v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-flex>
                <v-flex class="pr-2">
                  <v-dialog ref="pickerTime"
                            lazy
                            :close-on-content-click="false"
                            v-model="pickerTime"
                            transition="scale-transition"
                            width="290px"
                            :nudge-bottom="60"
                            :return-value.sync="pickedTime"
                  >
                    <v-text-field
                            slot="activator"
                            label="Time"
                            v-model="pickedTime"
                            prepend-icon="access_time"
                            hide-details
                            readonly
                    ></v-text-field>
                    <v-time-picker v-model="pickedTime" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat small color="primary" @click="pickerTime = false">Cancel</v-btn>
                      <v-btn flat small color="primary" @click="$refs.pickerTime.save(pickedTime)">OK</v-btn>
                    </v-time-picker>
                  </v-dialog>
                </v-flex>
              </v-flex>
            </transition>
            <v-alert type="warning" dismissible v-model="alertDateTime" transition="scale-transition">
              Please check date and time to add due.
            </v-alert>

            <transition name="slide-fade">
              <v-divider v-if="addDue"></v-divider>
            </transition>

            <v-layout align-center justify-center>
              <v-text-field v-model="title"
                            label="Subject"
                            full-width
                            hide-details
                            @keyup.enter="checkItem"
              ></v-text-field><v-btn ripple color="primary" @click="checkItem">SAVE</v-btn>
            </v-layout>

            <v-divider></v-divider>

            <v-layout>
              <v-flex>
                <transition name="slide-fade">
                  <v-text-field v-if="addDetail"
                                label="Detail"
                                v-model="detail"
                                max="500"
                                full-width
                                multi-line
                                no-resize
                                hide-details
                                auto-grow
                  ></v-text-field>
                </transition>
                <transition name="slide-fade">
                  <v-divider v-if="addDetail"></v-divider>
                </transition>
              </v-flex>
            </v-layout>

            <v-list two-line>
              <transition-group name="slide-fade" tag="v-flex">
                <v-layout v-for="(item, index) in list" :key="item.id">
                  <v-flex xs12 sm12 md12>
                    <v-list-tile :key="item.id" @click="toggleFinished(item, index)" ripple>
                      <v-list-tile-avatar>
                        <v-icon v-if="item.finished">done</v-icon>
                        <v-icon v-else>directions_run</v-icon>
                      </v-list-tile-avatar>

                      <v-list-tile-content :class="{ 'closed-issue': item.finished }">
                        <v-list-tile-title>{{ item.title }}<span v-if="item.dueRemaining" class="caption grey--text ml-3">{{ item.dueRemaining }}</span></v-list-tile-title>
                        <v-list-tile-sub-title v-if="item.detail">{{ item.detail }}</v-list-tile-sub-title>
                      </v-list-tile-content>

                      <v-list-tile-action>
                        <v-tooltip left v-if="item.pickedDue">
                          <v-icon slot="activator" color="primary" @click.stop="openDialog(item, index)">schedule</v-icon>
                          <span>{{ formatTime("LLL", item.pickedDue) }}</span>

                          <v-dialog persistent v-model="item.dialog" max-width="500px">
                            <v-card>
                              <v-card-title class="title">
                                Task {{ item.dueRemaining }}
                              </v-card-title>

                              <v-card-text>
                                <v-icon class="pr-2">schedule</v-icon><span>{{ formatTime("LLLL", item.pickedDue) }}</span>
                              </v-card-text>

                              <v-card-title class="title">
                                Add notifications
                              </v-card-title>

                              <v-card-text>
                                <v-flex d-flex row justify-center>
                                  <v-text-field
                                          class="pr-4"
                                          slot="activator"
                                          label="Number"
                                          v-model="pickedNotificationNumber"
                                          prepend-icon="add_alarm"
                                          hide-details
                                  ></v-text-field>
                                  <v-select
                                          :items="notificationMetrics"
                                          v-model="pickedNotificationMetric"
                                          label="Select"
                                          single-line
                                          auto
                                          prepend-icon="sort"
                                          hide-details
                                  ></v-select>
                                </v-flex>
                              </v-card-text>

                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="addNotification(item, index)">Add</v-btn>
                                <v-btn color="primary" @click.stop="closeDialog(item, index)">Close</v-btn>
                              </v-card-actions>

                              <v-card-text>
                                <v-list-tile v-for="(nt, index_nt) in item.notifications" :key="index_nt">
                                  <v-list-tile-avatar><v-icon>alarm</v-icon></v-list-tile-avatar>
                                  <v-list-tile-content class="caption">Before {{ nt.notificationNumber }} {{ findMetric(nt.notificationMetric, index_nt) }}</v-list-tile-content>
                                  <v-card-actions @click="removeNotification(item, index_nt, index)"><v-icon>delete_forever</v-icon></v-card-actions>
                                </v-list-tile>
                              </v-card-text>

                              <v-alert type="warning" dismissible v-model="alertNumberMetric" transition="scale-transition">
                                Please check date and time to add notification.
                              </v-alert>

                            </v-card>
                          </v-dialog>
                        </v-tooltip>

                        <v-icon v-if="item.detail" @click.stop="toggleShowDetail(item, index)" color="primary">info_outline</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-action>
                        <v-icon medium @click.stop="removeItem(item, index)" class="headline">close</v-icon>
                      </v-list-tile-action>
                    </v-list-tile>

                    <transition name="slide-fade" tag="v-list-tile">
                      <v-list-tile v-if="item.showDetail">
                        <v-list-tile-content>
                          {{ item.detail }}
                        </v-list-tile-content>
                      </v-list-tile>
                    </transition>
                  </v-flex>
                </v-layout>
              </transition-group>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>

    </v-container>
  </v-app>
</template>

<script>
  import moment from 'moment'

  export default {
    name: "app",
    data () {
      return {
        subscription: null,

        addDue: false,
        addDetail: false,
        pickerDate: false,
        pickerTime: false,
        pickedDate: null,
        pickedTime: null,

        id: null,
        title: null,
        detail: null,

        finished: false,

        pickedNotificationNumber: null,
        pickedNotificationMetric: null,

        alertNumberMetric: false,
        alertDateTime: false,

        list: [],

        notificationMetrics: [{
          text: 'minute(s)',
          value: 60
        },
          {
            text: 'hour(s)',
            value: 3600
          },
          {
            text: 'day(s)',
            value: 86400
          },
          {
            text: 'week(s)',
            value: 604800
          }],
      }
    },
    created () {
      this.$eventHub.$on('subscription', this.subscriptionCheck)
    },
    computed: {
      pickedDue: function () {
        if (this.pickedDate && this.pickedTime) {
          return moment(this.pickedDate + ' ' + this.pickedTime, "YYYY-MM-DD hh:mm").format("X")
        }
      },
    },
    watch: {
      list: function() {
        localStorage.setItem('vue-app-todo-F9DM348E', JSON.stringify(this.list));
      },
      deep: true
    },
    mounted: function() {
      if (localStorage.getItem('vue-app-todo-F9DM348E')) this.list = JSON.parse(localStorage.getItem('vue-app-todo-F9DM348E'));
      const msg = 'You have ' + this.list.length + ' item(s) to do!';

      this.checkDueRemaining();
      this.checkNotificationRemaining();

      this.interval = setInterval(function() {
        this.checkDueRemaining();
        this.checkNotificationRemaining();
      }.bind(this), 3e3)
    },
    methods: {
      addItem: function () {
        const now = new Date().getTime();

        if (this.title) {
          this.list.unshift({
            id: now,
            title: this.title,
            detail: this.detail,

            pickedDate: this.pickedDate,
            pickedTime: this.pickedTime,
            pickedDue: this.pickedDue,

            finished: this.finished,
          });

          this.pickedDate = null;
          this.pickedTime = null;
          this.pickerDate = false;
          this.pickerTime = false;

          this.id = null;
          this.title = null;
          this.detail = null;

          this.addDue = false;
          this.addDetail = false;

          this.finished = false
        }
      },
      checkItem: function() {
        if (this.title) {
          if (this.addDue) {
            if (!this.pickedDate || !this.pickedTime) {
              this.pickedDate = null;
              this.pickedTime = null;

              this.alertDateTime = true;
              setTimeout(() => { this.alertDateTime = false }, 3e3);

              return false
            }
          }
          this.addItem()
        }
      },
      removeItem: function(item, idx) {
        this.list.splice(idx, 1)
      },
      toggleShowDetail: function(item, idx) {
        this.$set(this.list, idx, item);

        item.showDetail = !item.showDetail
      },

      toggleFinished: function(item, idx) {
        this.$set(this.list, idx, item);

        item.finished = !item.finished
      },
      formatTime: function(fmt, unix) {
        return moment.unix(unix).format(fmt)
      },
      addNotification: function (item, idx) {
        if (!item.notifications) { item.notifications = [] }

        if (this.pickedNotificationNumber && this.pickedNotificationMetric) {
          item.notifications.push({notificationNumber: this.pickedNotificationNumber,  notificationMetric: this.pickedNotificationMetric, notified: false});

          this.pickedNotificationNumber = null;
          this.pickedNotificationMetric = null;

          this.$set(this.list, idx, item);
        } else {
          this.alertNumberMetric = true;
          setTimeout(() => { this.alertNumberMetric = false }, 3e3);
        }
      },
      removeNotification: function (item, idx_sub, idx_main) {
        item.notifications.splice(idx_sub, 1);

        this.$set(this.list, idx_main, item);
      },
      openDialog: function (item, idx) {
        item.dialog = true;

        this.$set(this.list, idx, item);
      },
      closeDialog: function (item, idx) {
        this.alertNumberMetric = false;
        item.dialog = false;

        this.$set(this.list, idx, item);
      },
      findMetric: function (num) {
        const obj = this.notificationMetrics.filter(function(elem) { return elem.value === num });

        return obj[0].text
      },
      fromNow: function (unix) {
        return moment(unix*1e3).fromNow()
      },
      checkDueRemaining: function () {
        if (this.list) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].pickedDue) {
              this.list[i].dueRemaining = moment(this.list[i].pickedDue * 1e3).fromNow()
            }
          }
        }
      },
      subscriptionCheck (subscriptionInfo) {
        this.subscription = subscriptionInfo
      },
      checkNotificationRemaining: function () {
        if (this.list) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].notifications) {
              for (let j = 0; j < this.list[i].notifications.length; j++) {
                let timeRemaining = (this.list[i].pickedDue - (this.list[i].notifications[j].notificationNumber * this.list[i].notifications[j].notificationMetric)) * 1e3 - new Date();

                if (timeRemaining <= 30e3 && !this.list[i].notifications[j].notified) {
                  this.$http.post('/api/push', {
                    subscription: this.subscription,
                    payload: this.list[i].title + ' (' + moment(this.list[i].pickedDue * 1e3).fromNow() + ')',
                  })
                    .then((res) => {
                      console.log(res);
                      if (res.data === 'PUSH OK') { this.list[i].notifications[j].notified = true }
                    })
                }
              }
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  .closed-issue {
    color: grey;
    text-decoration: line-through;
  }

  /* slide-fade */
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all .3s;
  }

  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateY(-72px);
    opacity: 0;
  }
</style>