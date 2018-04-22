from flask import Flask, request
from flask_compress import Compress

from pywebpush import webpush


class CustomFlask(Flask):
    jinja_options = Flask.jinja_options.copy()
    jinja_options.update(dict(
        variable_start_string='%%',
        variable_end_string='%%',
    ))


app = CustomFlask(__name__,
                  static_url_path='',
                  static_folder="./dist",
                  template_folder="./dist"
                  )

# Gzip service
Compress().init_app(app)


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/push', methods=['POST'])
def push():
    if request.method == 'POST':
        print(request.form)
        print(request.data)

        return "OK"
        # subscription_info =
        # data = 'from flask backend'
        #
        # webpush(subscription_info,
        #         data,
        #         vapid_private_key="w8wIyPTthxNiBjoXhGiIui968J7ZQKjxwSmRqE_YgZk")
        #
        # return app.send_static_file('index.html')


if __name__ == '__main__':
    # context = ('server.crt', 'server.key')
    app.run(host='127.0.0.1')
