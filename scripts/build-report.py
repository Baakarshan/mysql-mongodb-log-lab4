"""Build the current progressive-test report with the bundled document runtime."""
from pathlib import Path
import runpy
import sys

root = Path(__file__).resolve().parents[1]
if len(sys.argv) == 1:
    sys.argv.append(str(root))
runpy.run_path(str(root / 'scripts/build-adaptive-report.py'), run_name='__main__')
