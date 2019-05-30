from setuptools import setup, find_packages


setup (
    name = 'saien',
    version='0.2',
    description='Ideal website for Saien',
    packages = ['saien'],
    include_package_data = True,
    packages=find_packages(),
    install_requires =
    [
        'flask',
        'flask-login',
        'flask-sqlalchemy',
        'sqlalchemy-utils',
        'passlib',
    ],
)

    
