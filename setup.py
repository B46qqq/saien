from setuptools import setup


setup (
    name = 'saien',
    packages = ['saien'],
    include_package_data = True,
    install_requires =
    [
        'flask',
        'flask-sqlalchemy',
        'sqlalchemy-utils',
    ],
)

    
