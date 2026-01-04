import sys
import os
import traceback

try:
    from app import create_app
    app = create_app()
except Exception as e:
    print("!!! ERROR DURING APP STARTUP !!!")
    traceback.print_exc()
    sys.exit(1)

if __name__ == '__main__':
    app.run(debug=True)
