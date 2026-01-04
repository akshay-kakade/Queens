from app import create_app, db; app = create_app(); ctx = app.app_context(); ctx.push(); import datetime; db.create_all(); print('Migration complete - Advanced Order tables updated')
