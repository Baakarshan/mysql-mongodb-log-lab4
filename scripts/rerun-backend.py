"""Rerun one deployed backend into a separate bundle; credentials use the environment."""
from pathlib import Path
import argparse,subprocess,sys
import experiment as e
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('backend',choices=['mysql','mongo'])
p.add_argument('output',type=Path,help='Separate output directory; existing summaries are resumed')
a=p.parse_args();a.output=a.output.resolve()
(a.output/'results/runs').mkdir(parents=True,exist_ok=True)
(a.output/'evidence/preflight').mkdir(parents=True,exist_ok=True)
e.ROOT=a.output
try:
 e.run_backend(a.backend)
finally:
 for c in e.CLIENTS.values():c.close()
if a.backend=='mongo':
 subprocess.run([sys.executable,str(Path(__file__).with_name('collect-repository-originals.py')),str(a.output)],check=True)
 subprocess.run([sys.executable,str(Path(__file__).with_name('verify-repository-rerun.py')),str(a.output)],check=True)
