# Requires python3 to work since, python 3< does not implement %z.

import sys
import os
import re
import json
from datetime import datetime
import pytz
from subprocess import Popen, PIPE, STDOUT


class Version(object):
    def __init__(self, version):
        fix = re.search('[v]?(\d+)\.(\d+).(\d+).*', version).groups()
        self.major = int(fix[0])
        self.minor = int(fix[1])
        self.patch = int(fix[2])
        self.build = None
        self.tip = False

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return "v" + str(self.major) + "." + str(self.minor) + "." + str(self.patch)


class Changelog(object):
    def __init__(self, info):
        a, b, log = info
        self.log = log
        self.a = a
        self.b = b

    def denyReleases(self, log):
        return not ('release v' in log or 'Release v' in log)

    def log_in_between_versions(self):
        hash = self.log.split(' ')[0]

        if zeroversion(self.a):
            return ""

        date_time = git_log([str(self.a), "-1", '--format="%ad"']).split('\n')[0]

        if date_time is not '':
            dt = datetime.strptime(date_time, '%a %b %d %H:%M:%S %Y %z')
        else:
            dt = datetime.now()
        dt = dt.strftime('%a, %d %b %Y %H:%M:%S')

        log = str(self.a) + " - " + dt + " UTC\n"
        log = log + ("-" * (len(log) - 1)) + "\n\n"

        actual_log = list(filter(self.denyReleases, self.log.splitlines()))

        if len(actual_log) == 0:
            entries = '-\n\n'
        else:
            entries = "\n".join(map(url_entry, actual_log)) + "\n\n"

        log = log + entries

        return log

    def __str__(self):
        return self.__repr__(self)

    def __repr__(self):
        return "Changelog: " + self.log


def url_entry(entry):
    log = entry.split(' ')
    hash = log[0]
    log = ' '.join(log[1:])

    return "- [%s](../../commit/%s) %s" % (hash, hash, log)

def zeroversion(v):
    return v.major == 0 and v.minor == 0 and v.patch == 0

class compareversions(object):
    def __init__(self, obj, *args):
        self.obj = obj

    def __lt__(self, other):
        if self.obj.major < other.obj.major:
            return True
        if self.obj.minor < other.obj.minor:
            return True
        if self.obj.patch < other.obj.patch:
            return True
        return False

def git_exec(args):
    p = Popen(" ".join(["git"] + args), shell=True, stdout=PIPE, stderr=PIPE)
    out, err = p.communicate()
    return out.decode('utf-8')

def git_log(args):
    return git_exec(["log"] + args)

def adjacents(ls, f, res):
    if len(ls) == 0:
        return res

    first = ls[0]
    if len(ls) == 1:
        next = None
    else:
        next = ls[1]

    res.append(f(first, next))
    return adjacents(ls[1:], f, res)

def logs_between(a, b):
    v = a
    if b is None:
        _ = str(a)
    else:
        if a.tip:
            a = "HEAD"
        else:
            a = str(a)
        _ = str(b) + ".." + a
    return (v, b, git_log(["--format='%h %s'", _]))

def changelog(with_versions):
    process = with_versions
    versions = []

    generate_all = len(with_versions) == 0

    if generate_all:
        lines = git_exec(["tag", "-l"])
        process = lines.splitlines()

    for item in process:
        if not ('rc' in item or 'alpha' in item):
            versions.append(Version(item))

    versions = sorted(versions, key=compareversions, reverse=True)

    if generate_all:
        vs = map(Changelog, adjacents(versions, logs_between, []))
    else:
        versions[0].tip = True
        vs = map(Changelog, [logs_between(versions[0], versions[1])])

    return [v.log_in_between_versions() for v in vs]


if __name__ == "__main__":
    args = sys.argv[1:]
    for_version=[]

    if len(args) > 0:
        for_version = list(args)

    print("\n".join(changelog(for_version)))
