"""运行前只保留当前读或写采样器，避免每个请求克隆两套接口。"""
import argparse,copy,xml.etree.ElementTree as E
p=argparse.ArgumentParser();p.add_argument('source');p.add_argument('operation',choices=['read','write']);p.add_argument('output');a=p.parse_args()
t=E.parse(a.source)
for group in list(t.getroot().iter('hashTree')):
 children=list(group)
 for i,node in enumerate(children):
  if node.tag!='IfController':continue
  subtree=children[i+1];index=list(group).index(node)
  group.remove(node);group.remove(subtree)
  if node.get('testname')==a.operation:
   for k,el in enumerate(list(subtree)):group.insert(index+k,copy.deepcopy(el))
for subtree in list(t.getroot().iter('hashTree')):
 for node in list(subtree):
  if node.tag!='JSR223Assertion':continue
  index=list(subtree).index(node);subtree.remove(node)
  assertion=E.Element('ResponseAssertion',{'guiclass':'AssertionGui','testclass':'ResponseAssertion','testname':'Expected HTTP status','enabled':'true'})
  patterns=E.SubElement(assertion,'collectionProp',{'name':'Asserion.test_strings'});E.SubElement(patterns,'stringProp',{'name':'code'}).text='200' if a.operation=='read' else '201'
  E.SubElement(assertion,'stringProp',{'name':'Assertion.test_field'}).text='Assertion.response_code'
  E.SubElement(assertion,'boolProp',{'name':'Assertion.assume_success'}).text='false'
  E.SubElement(assertion,'intProp',{'name':'Assertion.test_type'}).text='8'
  subtree.insert(index,assertion)
t.write(a.output,encoding='UTF-8',xml_declaration=True)
