<template>
  <v-app id="app">
    <v-container fluid>

      <v-layout align-center justify-center>
        <v-flex xs12 sm10 md6>
          <v-card class="elevation-3">
            <v-toolbar height="64px" dark color="primary">
              <v-toolbar-title>#Todo</v-toolbar-title>

              <v-spacer></v-spacer>

              <v-toolbar-items class="align-center">
                <v-icon class="pr-2">watch</v-icon>
                <v-switch v-model="addDue" hide-details></v-switch>
              </v-toolbar-items>

              <v-toolbar-items class="align-center">
                <v-icon class="pr-2 pl-3">folder</v-icon>
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
                  <v-menu ref="pickerDate"
                          lazy
                          :close-on-content-click="false"
                          v-model="pickerDate"
                          transition="scale-transition"
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
                  </v-menu>
                </v-flex>
                <v-flex class="pr-2">
                  <v-menu ref="pickerTime"
                          lazy
                          :close-on-content-click="false"
                          v-model="pickerTime"
                          transition="scale-transition"
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
                  </v-menu>
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
                    <v-list-tile :key="item.id" @click="toggleFinished(item, index)">
                      <v-list-tile-avatar>
                        <v-icon v-if="item.finished">done</v-icon>
                        <v-icon v-else>airline_seat_recline_normal</v-icon>
                      </v-list-tile-avatar>

                      <v-list-tile-content :class="{ 'closed-issue': item.finished }">
                        <v-list-tile-title>{{ item.title }}<span v-if="item.timeRemaining"> {{ item.timeRemaining }}</span></v-list-tile-title>
                        <v-list-tile-sub-title v-if="item.detail">{{ item.detail }}</v-list-tile-sub-title>
                      </v-list-tile-content>

                      <v-list-tile-action>
                        <v-tooltip left v-if="item.pickedDue">
                          <v-icon slot="activator" color="primary" @click.stop="openDialog(item, index)">watch</v-icon>
                          <span>{{ formatTime("LLL", item.pickedDue) }}</span>

                          <v-dialog persistent v-model="item.dialog" max-width="500px">
                            <v-card>
                              <v-card-title class="title">
                                Task {{ item.timeRemaining }}
                              </v-card-title>

                              <v-card-text>
                                <v-icon class="pr-2">watch</v-icon><span>{{ formatTime("LLLL", item.pickedDue) }}</span>
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

                        <v-icon v-if="item.detail" @click.stop="toggleShowDetail(item, index)" color="primary">
                          {{ !item.showDetail ? 'folder' : 'folder_open' }}
                        </v-icon>
                      </v-list-tile-action>
                      <v-list-tile-action>
                        <v-icon medium @click.stop="removeItem(item, index)">remove</v-icon>
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

        list: [
        ],

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
      }
    },
    mounted: function() {
      if (localStorage.getItem('vue-app-todo-F9DM348E')) this.list = JSON.parse(localStorage.getItem('vue-app-todo-F9DM348E'));
      const msg = 'You have ' + this.list.length + ' item(s) to do!';

      this.checkTimeRemaining();

      this.interval = setInterval(function() {
        this.checkTimeRemaining()
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
          item.notifications.push({notificationNumber: this.pickedNotificationNumber,  notificationMetric: this.pickedNotificationMetric});

          this.pickedNotificationNumber = null;
          this.pickedNotificationMetric = null;

          this.$set(this.list, idx, item);
          // this.list[idx].notifications = item.notifications  // This is wrong!
        } else {
          this.alertNumberMetric = true;
          setTimeout(() => { this.alertNumberMetric = false }, 3e3);
        }
      },
      removeNotification: function (item, idx_sub, idx_main) {
        item.notifications.splice(idx_sub, 1);

        this.$set(this.list, idx_main, item);
        // this.list[idx_main].notifications = item.notifications  // This is wrong!
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
      checkTimeRemaining: function () {
        if (this.list) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].pickedDue) {
              this.list[i].timeRemaining = moment(this.list[i].pickedDue * 1e3).fromNow()
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