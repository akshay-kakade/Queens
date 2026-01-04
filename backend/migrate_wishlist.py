from app import create_app, db; app = create_app(); ctx = app.app_context(); ctx.push(); db.create_all(); print('Migration complete - Wishlist table created')
