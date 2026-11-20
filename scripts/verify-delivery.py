"""核对当前单次线程实验交付。"""
from pathlib import Path
import subprocess,sys
root=Path(__file__).resolve().parents[1]
subprocess.run([sys.executable,str(root/"scripts/verify-threads.py"),str(root)],check=True)
