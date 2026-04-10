import logging
from web_api import create_app

# Disable Werkzeug logging to terminal entirely
log = logging.getLogger('werkzeug')
log.disabled = True
log.setLevel(logging.ERROR)

app = create_app()

if __name__ == '__main__':
    # Disable click echo from Flask CLI
    import click
    def secho(*args, **kwargs):
        pass
    click.echo = secho
    click.secho = secho
    
    # Run the app without the reloader spam, keeping the terminal clean
    app.run(debug=True, host='0.0.0.0', port=5050, use_reloader=False)