from flask import Flask
from flask_compress import Compress


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


if __name__ == '__main__':
    # context = ('server.crt', 'server.key')
    app.run(host='127.0.0.1')
