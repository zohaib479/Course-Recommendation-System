from setuptools import find_packages, setup
from typing import List
def get_requirements():
    requirements_lst = []
    try:
        with open("requirements.txt", "r") as file:
            lines = file.readlines()
            for line in lines:
                requirement = line.strip()
                if requirement and requirement != "-e .":
                    requirements_lst.append(requirement)
        
        return requirements_lst
    except FileNotFoundError as e:
        print(e)
setup(
    name = "Course-Recommender",
    version="0.0.1",
    author = "zohaib",
    author_email="zohaibrajput215@gmail.com",
    packages=find_packages(),
    install_requires = get_requirements()
)
        